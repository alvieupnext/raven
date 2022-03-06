import { interval, map, from, combineLatestWith, mergeAll, filter, zip, tap, pluck, take, observable, Subject, buffer } from 'rxjs';
import { getExporter } from './exports';
import { dereference, drawHand, mirrorDirection, refreshRate, setJSON, setOrigin, setValue, transformValue } from './Utilities';
import * as mp from '@mediapipe/hands';
import * as fp from 'fingerpose'
import { four, highFive, secondary, okaySign, phone, pointUp, stopSign, three, thumbsDown, thumbsLeft, thumbsRight, thumbsUp, victory, yeah } from './gestures';
import { EmptyArrayFilter, FrequencyThreshold, SortByBestGesture, SortByHighestFrequency } from './filters';

//the stream that starts emitting as first, known as the prime data stream
let primeStream = interval(refreshRate)
  .pipe(map(number => { return { value: number } }))
  .pipe(map(json => setOrigin(json, 'prime')))
  .pipe(getExporter())

//get videoFeed from webcam
function videoFeed(webcamRef, canvasRef) {
  // Check data is available
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    // Get Video Properties
    // webcamRef.current.mirrored = true
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    return video
  }
};

function webcamStream(webcamRef, canvasRef) {
  return function (observable) {
    const hand = interval(refreshRate).pipe(map(value => videoFeed(webcamRef, canvasRef)), filter(value => value !== undefined))

    return zip(observable, hand)
      .pipe(map(([json, video]) => setValue(json, video)))
      .pipe(map(json => setOrigin(json, 'webcam')))
      .pipe(getExporter())

  }
}


//send a dummy value to the model in order to force the hand model to load
function loadModel() {
  handModel.send(5)
}

//do not disable cache
let handModel = new mp.Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
handModel.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const result = new Subject()


handModel.initialize();

function mediapipeStream(canvasRef) {

  function onResult(results) {
    result.next(results)
  }

  handModel.onResults(onResult)

  return function (observable) {
    const net = observable.pipe(pluck('value'), tap(value => { handModel.send({ image: value }) }))

    const res = result.pipe(tap(data => drawHand(data, canvasRef)))

    return zip(observable, res, net)
      .pipe(map(([json, landmark, net]) => setValue(json, landmark)))
      .pipe(map(json => setOrigin(json, 'mediapipe')))

      .pipe(getExporter())
  }
}

function fingerposeStream(observable) {
  const GE = new fp.GestureEstimator([
    victory,
    // secondary,
    okaySign,
    thumbsDown,
    highFive,
    stopSign,
    thumbsRight,
    thumbsUp,
    thumbsLeft,
    pointUp,
    three,
    four,
    yeah,
    phone,
  ])

  function fromTensorFlow(hand) {
    return [{ gesture: GE.estimate(hand[0].landmarks, 8), hand: 'one' }]
  }

  //remember we have to mirror the hands to keep consistent with the whole program
  function fromMediaPipe(hands) {
    let result = []
    let length = hands.multiHandWorldLandmarks.length
    for (let place of hands.multiHandedness) {
      let index = place.index
      result.push({ gesture: GE.estimate(convertLandmarks(hands.multiHandWorldLandmarks[index % length]), 8), hand: mirrorDirection(place.label) })
    }
    return result
  }

  function convertLandmarks(landmark) {
    let index = 0;
    let clone = dereference(landmark)
    for (let point of landmark) {
      delete point.visibility
      let array = Object.values(point)
      clone[index] = array
      index++
    }
    return clone
  }

  function predict(json) {
    if (json.origin === 'tensorflow') {
      transformValue(json, (hand => fromTensorFlow(hand)))

    }
    else {
      transformValue(json, (hands => fromMediaPipe(hands)))
    }
    return setOrigin(json, 'fingerpose')
  }

  return observable
    .pipe(map(predict))
    .pipe(getExporter())
}

//gesture array needs to be sorted before using this procedure
function extractBestGesture(hands) {
  let result = []
  for (let hand of hands) {
    let clone = dereference(hand)
    let name = (hand.gesture.gestures.length !== 0 ? hand.gesture.gestures[0].name : "no_gesture")
    result.push(setJSON(clone, 'gesture', name))
  }
  return result
}

function gesturer(observable) {
  return observable
    .pipe(SortByBestGesture)
    .pipe(map(json => transformValue(json, extractBestGesture)))
    .pipe(map(json => setOrigin(json, 'gesture')))
    .pipe(getExporter())
}

//one-handed commands
const one_hand = {
  thumbs_up: 'up',
  thumbs_right: 'right',
  thumbs_left: 'left',
  thumbs_down: 'down',
  stop: 'land',
  yeah: 'forward',
  phone: 'back',
  okay: 'stop',
  one: 1,
  victory: 2,
  three: 3,
  four: 4,
  high_five: 5,
}

//commands for two hands
const two_hand = {
  thumbs_up: 'up',
  thumbs_right: 'right',
  thumbs_left: 'left',
  thumbs_down: 'down',
  stop: 'land',
  yeah: 'forward',
  phone: 'back',
  okay: 'secondary',
  one: 1,
  victory: 2,
  three: 3,
  four: 4,
  high_five: 5,
}

const two_hand_alt = {
  thumbs_up: 'ccw',
  thumbs_down: 'cw',
  thumbs_left: 'flip_left',
  thumbs_right: 'flip_right',
  yeah: 'flip_forward',
  phone: 'flip_back',
}

const dict = {
  Left: one_hand,
  Right: one_hand
}

function toCommand(command, hand){
  return {command: command, hand: hand}
}

function translateGesture(value) {
  if (value.length === 1){ //single
    return toCommand(one_hand[value[0].gesture], value[0].hand)
  }
  else {//compound
    let command1 = two_hand[value[0].gesture]
    let command2 = two_hand[value[1].gesture]
    if (command1 === 'secondary'){ //using secondary menu
      return toCommand(two_hand_alt[value[1].gesture], value[1].hand)
    }
    if (command2 === 'secondary'){
      return toCommand(two_hand_alt[value[0].gesture], value[0].hand)
    }
    if (typeof command1 === 'number' && typeof command2 === 'number'){ //numbers from both hands
      return toCommand(command1 + command2, "both")
    }
    else return toCommand(one_hand[value[0].gesture], value[0].hand) //give priority to the first one
  }
}

function commandStream(observable) {
  return observable
    .pipe(map(json => transformValue(json, translateGesture)))
    .pipe(map(json => setOrigin(json, 'command')))
    .pipe(getExporter())
}

function bufferStream(ms) {
  return function (observable) {
    const intervalEvents = interval(ms)
    // const bufferedStream = observable.pipe(buffer(intervalEvents))
    return observable
      .pipe(buffer(intervalEvents))
      .pipe(map(arr => {return {value: arr}}))
      .pipe(map(json => setOrigin(json, 'buffer')))
      .pipe(getExporter())
  }
}

//TODO solve frequency glitch with frequencies being over 1
function frequencyStream(observable) {
  function frequency(json) {
    let occurences = []
    let array = json.value
    let count = array.length
      for (let element of array) {
        for (let command of element.value){
          let key = command.command
          let found = occurences.find(json => json.name === key && json.hand === command.hand)
          if (found === undefined){ //not found (does not yet exist)
            occurences.push({name: key, hand: command.hand, score: 1})
          }
          else { //element found
            found.score += 1
          }
        }
      }
      for (let occurence of occurences){
        occurence.score /= count
      }
      return setValue(json, occurences)
    }
  return observable
    .pipe(EmptyArrayFilter)
    .pipe(map(frequency))
    .pipe(SortByHighestFrequency)
    .pipe(FrequencyThreshold(0.5))
    .pipe(EmptyArrayFilter)
    .pipe(map(json => setOrigin(json, 'frequency')))
    .pipe(getExporter())
}







export { webcamStream, primeStream, mediapipeStream, loadModel, fingerposeStream, gesturer, commandStream, bufferStream, frequencyStream }
import { interval, map,filter, zip, tap, pluck, Subject, buffer } from 'rxjs';
import { getExporter } from './exports';
import { dereference, drawHand, mirrorDirection, setJSON, setOrigin, setValue, transformValue } from './Utilities';
import * as mp from '@mediapipe/hands';
import * as fp from 'fingerpose'
import { four, highFive, phone, pointUp, stopSign, three, thumbsDown, thumbsLeft, thumbsRight, thumbsUp, victory, yeah, emperor } from './gestures';
import { EmptyArrayFilter, NoGestureFilter, SortByBestGesture, SortByHighestFrequency } from './filters';
import { one_hand, two_hand, two_hand_alt, refreshRate, MAX_HANDS, GESTURE_CONFIDENCE } from './settings';

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


let handModel = new mp.Hands({
  locateFile: (file) => {
    //use this link for overall use (do not disable cache)
    // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    //use this link for offline loading (requires server)
    return "http://localhost:4000/hands/" + file;
  }
});
handModel.setOptions({
  maxNumHands: MAX_HANDS,
  modelComplexity: 1,
  minDetectionConfidence: 0.75,
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
    emperor,
  ])
  //remember we have to mirror the hands to keep consistency with the whole program
  function fromMediaPipe(hands) {
    let result = []
    let length = hands.multiHandWorldLandmarks.length
    for (let place of hands.multiHandedness) {
      let index = place.index
      result.push({ gesture: GE.estimate(convertLandmarks(hands.multiHandWorldLandmarks[index % length]), GESTURE_CONFIDENCE), hand: mirrorDirection(place.label) })
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
    transformValue(json, (hands => fromMediaPipe(hands)))
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
    .pipe(NoGestureFilter)
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
      for (let command of array) {
          let key = command.value.command
          let hand = command.value.hand
          let found = occurences.find(json => json.name === key && json.hand === hand)
          if (found === undefined){ //not found (does not yet exist)
            occurences.push({name: key, hand: hand, score: 1})
          }
          else { //element found
            found.score += 1
          }
        }
      for (let occurence of occurences){
        occurence.score /= count
      }
      return setValue(json, occurences)
    }
  function motion(json){
    let array = json.value
    if (array.length !== 1){ //single element, no compound statement
      let first_command = array[0]
      let second_command = array[1]
      if (first_command.name === "up"){
        switch (second_command.name){ //flip by flicking the wrist
          case "left": first_command.name = "flip_l"; break;
          case "right": first_command.name = "flip_r"; break;
          case "down": first_command.name = "flip_b"; break;
          default: break;
        }
      }
      else if (first_command.name === "down" && second_command.name === "up"){
        first_command.name = "flip_f"
      }
    }
    return json
  }
  return observable
    .pipe(EmptyArrayFilter)
    .pipe(map(frequency))
    .pipe(SortByHighestFrequency)
    // .pipe(FrequencyThreshold(0.15))
    .pipe(map(motion))
    .pipe(EmptyArrayFilter)
    .pipe(tap(data => console.log(data.value)))
    //get single element
    .pipe(map(json => transformValue(json, (array => array[0]))))
    .pipe(map(json => setOrigin(json, 'frequency')))
    .pipe(getExporter())
}







export { webcamStream, primeStream, mediapipeStream, loadModel, fingerposeStream, gesturer, commandStream, bufferStream, frequencyStream }
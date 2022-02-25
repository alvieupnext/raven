import { interval, map, from, combineLatestWith, mergeAll, filter, zip, tap, pluck, take, observable, Subject} from 'rxjs';
import { exporter } from './exports';
import { dereference, drawHand, logToApp, mirrorDirection, refreshRate, setJSON, setOrigin, transformValue } from './Utilities';
import * as mp from '@mediapipe/hands';
import * as fp from 'fingerpose'
import { four, highFive, okaySign, phone, pointUp, stopSign, three, thumbsDown, thumbsLeft, thumbsRight, thumbsUp, victory, yeah } from './gestures';
import { SortByBestGesture } from './filters';

//the stream that starts emitting as first, known as the prime data stream
let primeStream = interval(refreshRate)
  .pipe(map(number => { return { value: number } }))
  .pipe(map(json => setOrigin(json, 'prime')))
  .pipe(exporter)

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
      .pipe(map(([json, video]) => setJSON(json, 'value', video)))
      .pipe(map(json => setOrigin(json, 'webcam')))
      .pipe(exporter)

  }
}


//send a dummy value to the model in order to force the hand model to load
function loadModel() {
  logToApp("Loading Hand Detection Model")
  handModel.send(5)
  logToApp("Loaded Hand Detection Model")
}

let handModel = new mp.Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  }
});
handModel.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});


handModel.initialize();

function mediapipeStream(canvasRef) {

  const result = new Subject().pipe(tap(data => drawHand(data, canvasRef)))

  function onResult(results) {
    result.next(results)
  }

  handModel.onResults(onResult)

  return function (observable) {
    const net = observable.pipe(pluck('value'), tap(value => { handModel.send({ image: value }) }))

    return zip(observable, result, net)
      .pipe(map(([json, landmark, net]) => setJSON(json, 'value', landmark)))
      .pipe(map(json => setOrigin(json, 'mediapipe')))

      .pipe(exporter)
  }
}

function fingerposeStream(observable){
  const GE = new fp.GestureEstimator([
    victory, 
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

  function fromTensorFlow(hand){
    return [{gesture: GE.estimate(hand[0].landmarks, 8), hand: 'one'}]
  }

  //remember we have to mirror the hands to keep consistent with the whole program
  function fromMediaPipe(hands){
    let result = []
    let length = hands.multiHandWorldLandmarks.length
    for (let place of hands.multiHandedness){
      let index = place.index
      result.push({gesture: GE.estimate(convertLandmarks(hands.multiHandWorldLandmarks[index % length]), 8), hand: mirrorDirection(place.label)})
    }
    return result
  }

  function convertLandmarks(landmark){
    let index = 0;
    let clone = dereference(landmark)
    for (let point of landmark){
      delete point.visibility
      let array = Object.values(point)
      clone[index] = array
      index++
    }
    return clone
  }

  function predict(json){
    if (json.origin === 'tensorflow'){
      transformValue(json, (hand => fromTensorFlow(hand)))
      
    }
    else {
      transformValue(json, (hands => fromMediaPipe(hands)))
    }
    return setOrigin(json, 'fingerpose')
  }

  return observable
  .pipe(map(predict))
  .pipe(exporter)
}

//gesture array needs to be sorted before using this procedure
function extractBestGesture(hands){
  let result = []
  for (let hand of hands){
    let clone = dereference(hand)
    let name = (hand.gesture.gestures.length !== 0 ?  hand.gesture.gestures[0].name : "no_gesture")
    result.push(setJSON(clone, 'gesture', name))
  }
  return result
}

function gesturer(observable){
  return observable
  .pipe(SortByBestGesture)
  .pipe(map(json => transformValue(json, extractBestGesture)))
  .pipe(map(json => setOrigin(json,'gesture')))
  .pipe(exporter)
}



export { webcamStream, primeStream, mediapipeStream, loadModel, fingerposeStream, gesturer}
import { interval, map, from, combineLatestWith, mergeAll, filter, zip, tap, pluck, take, observable, Subject, asyncScheduler } from 'rxjs';
import { exporter } from './exports';
import { drawHand, refreshRate, setJSON, setOrigin } from './Utilities';
import * as mp from '@mediapipe/hands';

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

let handModel;

async function getHands() {
  let hands = await new mp.Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    }
  });
  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  console.log("Mediapipe Model Loaded")
  return hands
}




console.log(handModel)

//create a new instance of the ML model for detecting hands
// const hands = new mp.Hands({
//   locateFile: (file) => {
//     console.log(file)
//     return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
//   }
// });
// hands.setOptions({
//   maxNumHands: 2,
//   modelComplexity: 1,
//   minDetectionConfidence: 0.5,
//   minTrackingConfidence: 0.5
// });

//Mediapipe stream to turn videofeed into landmarks
    console.log(getHands().then(data=> { handModel = data; handModel.onResults(onResult); handModel.initialize();console.log(handModel)}))

const result = new Subject().pipe(tap(data => console.log(data)))

function onResult(results) {
  result.next(results)
}

function sendTest(video){
  handModel.initialize()
}
function mediapipeStream(canvasRef) {

  return function (observable) {
      const net = observable.pipe(pluck('value'), tap(value => {handModel.send({image: value})}), tap(value => console.log(value)))

    return zip(observable, result, net)
      .pipe(map(([json, landmark, net]) => setJSON(json, 'value', landmark)))
      .pipe(map(json => setOrigin(json, 'mediapipe')))

      .pipe(exporter)
  }
}



export { webcamStream, primeStream, mediapipeStream, sendTest }
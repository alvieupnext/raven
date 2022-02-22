import { interval, map, from, combineLatestWith, mergeAll, filter, zip, tap, pluck, observable, Subject } from 'rxjs';
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

//create a new instance of the ML model for detecting hands
const hands = new mp.Hands({
  locateFile: (file) => {
    console.log(file)
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

//Mediapipe stream to turn videofeed into landmarks

function mediapipeStream(canvasRef) {
  const net = from(hands.initialize()).pipe(tap(console.log("Mediapipe model loaded."))); //make it a observable
  hands.onResults(onResult)
  const result = new Subject().pipe(tap(json => { drawHand(json, canvasRef); }))//initialize a subject to push the result values
  function onResult(results) {
    result.next(results)
  }
  return function (observable) {

    observable
      .pipe(pluck('value'), combineLatestWith(net),
    ) //only start predicting when the model gets loaded
      .pipe(tap(([video, empty]) => hands.send({ image: video }))) //returns a stream full of Observables
      .subscribe()

    return zip(observable, result)
      .pipe(map(([json, landmark]) => setJSON(json, 'value', landmark)))
      .pipe(map(json => setOrigin(json, 'mediapipe')))

      .pipe(exporter)
  }
}



export { webcamStream, primeStream, mediapipeStream }
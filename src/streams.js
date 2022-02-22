import {interval, map, from, combineLatestWith, mergeAll, filter, zip, tap, pluck, observable, Subject} from 'rxjs';
import { exporter } from './exports';
import { refreshRate, setJSON, setOrigin } from './Utilities';



//get videoFeed from webcam
function videoFeed (webcamRef, canvasRef) {
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

  function createWebcamStream(videoFeed){
      return function(observable){
        const hand = interval(refreshRate).pipe(map(value => videoFeed()), filter(value => value !== undefined))
  
        return zip(observable, hand)
        .pipe(map(([json, video]) => setJSON(json, 'value', video)))
        .pipe(map(json => setOrigin(json,'webcam')))
        .pipe(exporter)

      }
  }

  export {videoFeed, createWebcamStream}
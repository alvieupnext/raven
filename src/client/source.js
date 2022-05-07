import { webcamStream, primeStream, mediapipeStream,  fingerposeStream, gesturer, commandStream, bufferStream, frequencyStream } from './streams.js';
import { EmptyHandFilter } from './filters';
import { DETECTION_INTERVAL } from './settings.js';

function createRaven(webcamRef, canvasRef){
    return primeStream
    .pipe(webcamStream(webcamRef, canvasRef),
    mediapipeStream(canvasRef),
    EmptyHandFilter,
    fingerposeStream,
    gesturer,
    commandStream,
    bufferStream(DETECTION_INTERVAL),
    frequencyStream,
)
}

export {createRaven}

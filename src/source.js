import { webcamStream, primeStream, mediapipeStream,  fingerposeStream, gesturer, commandStream, bufferStream, frequencyStream } from './streams.js';
import { EmptyHandFilter } from './filters';

function createRaven(webcamRef, canvasRef){
    console.log("help")
    return primeStream
    .pipe(webcamStream(webcamRef, canvasRef),
    mediapipeStream(canvasRef),
    EmptyHandFilter,
    fingerposeStream,
    gesturer,
    commandStream,
    bufferStream(1500),
    frequencyStream,
)
}

export {createRaven}

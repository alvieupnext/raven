import { webcamStream, primeStream, mediapipeStream, loadModel, fingerposeStream, gesturer, commandStream, bufferStream, frequencyStream} from './streams.js';
import {setExporter, completeExport} from './exports'
import { consoleSubscriber, logSubscriber, telloSubscriber } from './subscribers';
import { EmptyHandFilter } from './filters';

// setExporter(completeExport)

//Raven, the example of controlling a drone
function createRaven(webcamRef, canvasRef){
    return primeStream.pipe(webcamStream(webcamRef, canvasRef), 
    mediapipeStream(canvasRef),
    EmptyHandFilter,
    fingerposeStream,
    gesturer,
    commandStream,
    bufferStream(1500),
    frequencyStream,
    )
}

function startRaven(raven){
    return raven.subscribe(telloSubscriber)
}

function stopRaven(raven){
    raven.unsubscribe()
}

export {createRaven, startRaven, stopRaven}
import { webcamStream, primeStream, mediapipeStream, loadModel, fingerposeStream, gesturer} from './streams.js';
import {setExporter, completeExport} from './exports'
import { consoleSubscriber, logSubscriber } from './subscribers';
import { EmptyHandFilter } from './filters';

setExporter(completeExport)

//Raven, the example of controlling a drone
function createRaven(webcamRef, canvasRef){
    return primeStream.pipe(webcamStream(webcamRef, canvasRef), 
    mediapipeStream(canvasRef),
    EmptyHandFilter,
    fingerposeStream,
    gesturer,
    )
}

function startRaven(raven){
    return raven.subscribe(logSubscriber)
}

function stopRaven(raven){
    raven.unsubscribe()
}

export {createRaven, startRaven, stopRaven}
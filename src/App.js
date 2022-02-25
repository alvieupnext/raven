import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logToApp} from './Utilities';
import {setExporter, completeExport} from './exports'
import { webcamStream, primeStream, mediapipeStream, loadModel, fingerposeStream, gesturer} from './streams.js';
import { consoleSubscriber, logSubscriber } from './subscribers';
import { EmptyHandFilter } from './filters';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [buttonText, setButtonText] = useState("Start")

  setExporter(completeExport)
  

  let streams = [
    primeStream.pipe(webcamStream(webcamRef, canvasRef), 
    mediapipeStream(canvasRef),
    EmptyHandFilter,
    fingerposeStream,
    gesturer,
    )
  ]

  var running = useRef(false);
  let subscriptions = []

  function toggleSub(){
    if (!running.current) {
      for (let source of streams){
        let disposeable = source.subscribe(logSubscriber) 
        subscriptions.push(disposeable)
        setButtonText("Stop")
      }
    }
    else {
      subscriptions.forEach((sub) => sub.unsubscribe());
      setButtonText("Resume")
    }
    running.current = !running.current
  }

  


  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Col>
          
            <Webcam
              mirrored={true}
              ref={webcamRef}
              style={{
                width: 640, height: 480,
                // zindex: -1,
                position: 'absolute',
                // position: 'relative',
              }}
            
            
            />

            <canvas
              ref={canvasRef}
              style={{
                width: 640, height: 480, 
                transform: 'scaleX(-1)',
                // position: 'absolute',
                
              }}
              />
            
            </Col>
              <p className="text-justify" id="appLog">Welcome To Raven!</p>
          
          <Button variant="primary" onClick={e => loadModel()}>Load Mediapipe Model</Button>
          <Button variant="secondary" onClick={e => console.log(canvasRef)}>Ref?</Button>
          <Button variant={(running.current ? "danger" : "success" )} id="toggle" onClick={e => toggleSub()}>{buttonText}</Button>
          
          
        </Container>


      </header>
    </div>

  );
}

export default App;

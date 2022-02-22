import React, { useRef } from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logToApp} from './Utilities';
import {setExporter, completeExport} from './exports'
import { createWebcamStream, primeStream} from './streams';
import { consoleSubscriber } from './subscribers';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  let streams = [
    primeStream.pipe(createWebcamStream(webcamRef, canvasRef))
  ]

  let on = false;
  let subscriptions = []

  function toggleSub(){
    if (!on) {
      for (let source of streams){
        let disposeable = source.subscribe(consoleSubscriber) 
        subscriptions.push(disposeable)
      }
    }
    else subscriptions.forEach((sub) => sub.unsubscribe());
    on = !on
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
                position: 'absolute',
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                width: 640, height: 480,
                // position: 'absolute'
              }}
            />
            
            </Col>
              <p class="text-justify" id="appLog">logable</p>
          
          <Button variant="primary" onClick={e => logToApp("kaas")}>kaasprinter</Button>
          <Button variant="success" id="toggle" onClick={e => toggleSub()}>Start</Button>
          
          
        </Container>


      </header>
    </div>

  );
}

export default App;

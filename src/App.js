import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { setExporter, completeExport, vanillaExport, minimalExport } from './exports'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { logToApp } from './Utilities';
import { createRaven, startRaven, stopRaven } from './raven';
import { loadModel } from './streams';
import { Drone } from './drone';


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const raven = useRef(null)




  // function updateExporter(eventKey) {
  //   //access the right export function and set it as exporter
  //   setExporter(exporters[eventKey])
  //   //confirm to the user and if the stream is running, remind them to resubscribe to the stream
  //   logToApp(`Changed output to ${names[eventKey]}. ` + (running.current ? "Please stop and resume the stream" : ""), "appLog")
  // }

  // function LoadMediaPipeButton(props) {
  //   if (!loaded) {
  //     return (
  //       <Button variant="info" onClick={e => { logToApp("Loading Hand Detection Model", "appLog"); loadModel(); setLoaded(true); logToApp("Loaded Hand Detection Model", "appLog") }}>Load Mediapipe Model</Button>
  //     );
  //   }
  //   else return (<div></div>)
  // }




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
          {/* <LoadMediaPipeButton></LoadMediaPipeButton> */}
          <Drone canvas={canvasRef} webcam={webcamRef} ></Drone>
          {/* <label for="customRange1" class="form-label">Example range</label> */}
          {/* <form class="multi-range-field my-5 pb-5">
            <input id="multi" class="multi-range" type="range" />
          </form> */}
          {/* <input type="range" class="form-range" id="customRange1"></input> */}
          {/* <Button variant="secondary" onClick={e => setExporter(completeExport)}>Change Export Settings</Button> */}

        </Container>


      </header>
    </div>

  );
}

export default App;

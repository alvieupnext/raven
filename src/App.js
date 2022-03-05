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
import { sendToDrone } from './drone';
import Slider from'@mui/material/Slider';


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [buttonText, setButtonText] = useState("Start")
  const [loaded, setLoaded] = useState(false)
  const raven = useRef(null)



  var running = useRef(false);


  function toggleSub() {
    if (!running.current) {
      raven.current = createRaven(webcamRef, canvasRef)
      raven.current = startRaven(raven.current)
      setButtonText("Stop")
      if (!loaded) {
        setLoaded(true)
      }
    }
    else {
      stopRaven(raven.current)
      setButtonText("Resume")
    }
    running.current = !running.current
  }

  const exporters = [completeExport, vanillaExport, minimalExport]
  const names = ["Complete", "Vanilla", "Minimal"]

  function updateExporter(eventKey) {
    //access the right export function and set it as exporter
    setExporter(exporters[eventKey])
    //confirm to the user and if the stream is running, remind them to resubscribe to the stream
    logToApp(`Changed output to ${names[eventKey]}. ` + (running.current ? "Please stop and resume the stream" : ""), "appLog")
  }

  function LoadMediaPipeButton(props) {
    if (!loaded) {
      return (
        <Button variant="primary" onClick={e => { logToApp("Loading Hand Detection Model", "appLog"); loadModel(); setLoaded(true); logToApp("Loaded Hand Detection Model", "appLog") }}>Load Mediapipe Model</Button>
      );
    }
    else return (<div></div>)
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
          <p className="text-justify" >Tello Command History:</p>
          <p className="text-justify" id="telloLog">[]</p>
          <LoadMediaPipeButton></LoadMediaPipeButton>
          <Button variant={(running.current ? "danger" : "success")} id="toggle" onClick={e => toggleSub()}>{buttonText}</Button>
          {/*TODO takeoff and land glitch with pressing buttons */}
          <Button variant="success" onClick={e => sendToDrone([{ name: 'takeOff' }])}>TakeOff</Button>
          <Button variant="danger" onClick={e => sendToDrone([{ name: 'emergencyLand' }])}>Land</Button>
          <Dropdown onSelect={(eventKey, event) => updateExporter(eventKey)}>
            <Dropdown.Toggle variant="light" id="dropdown-button-drop-right">
              Change Output Settings
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item eventKey={0}>Complete</Dropdown.Item>
              <Dropdown.Item eventKey={1}>Vanilla</Dropdown.Item>
              <Dropdown.Item eventKey={2}>Minimal</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* <label for="customRange1" class="form-label">Example range</label> */}
          {/* <form class="multi-range-field my-5 pb-5">
            <input id="multi" class="multi-range" type="range" />
          </form> */}
          <Slider defaultValue={20} aria-label="Default" valueLabelDisplay="auto" color="secondary"/>
          {/* <input type="range" class="form-range" id="customRange1"></input> */}
          {/* <Button variant="secondary" onClick={e => setExporter(completeExport)}>Change Export Settings</Button> */}



        </Container>


      </header>
    </div>

  );
}

export default App;

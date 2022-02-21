import React, { useRef } from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {logToApp} from './Utilities';
import {vanillaExport, completeExport} from './exports'

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  var exporter = vanillaExport

  exporter = completeExport

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
          
          <Button variant="primary" onClick={e => logToApp("kaas")}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          
          
        </Container>


      </header>
    </div>

  );
}

export default App;

import React, { useRef } from 'react'
import Webcam from 'react-webcam';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Drone } from './drone';


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);



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
          <Drone canvas={canvasRef} webcam={webcamRef} ></Drone>

        </Container>


      </header>
    </div>

  );
}

export default App;

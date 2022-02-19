import React, { useRef } from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';







function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  function myLog(message) {
    document.getElementById("myLog").innerHTML = message
  };

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
              <p id="myLog">logable</p>
          
          <Button variant="primary" onClick={e => myLog("kaas")}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          
          
        </Container>


      </header>
    </div>

  );
}

export default App;

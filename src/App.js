import React, {useRef} from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';







function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // var context = canvasRef.getContext('2d');
  // // Reset the current path
  // context.beginPath(); 
  // // Staring point (10,45)
  //  context.moveTo(10,45);
  // // End point (180,47)
  // context.lineTo(180,47);
  // // Make the line visible
  // context.stroke();

  return (
    <div className="App">
    <header className="App-header">
      <Container>
      {/* <Stack gap={3} direction="vertical"> */}
      <Col>

    <Webcam 
        mirrored={true}
        ref={webcamRef}
        style = {{width: 640, height: 480, 
          position: 'absolute',
        }}
        />
        <canvas
        ref={canvasRef}
        style= {{width: 640, height: 480, 
          // position: 'absolute'
        }}
      />
      </Col>
     <Button variant="primary">Primary</Button>{' '}
    <Button variant="secondary">Secondary</Button>{' '}
    {/* </Stack> */}

      </Container>



      

    </header>
  </div>
  
  );
}

export default App;

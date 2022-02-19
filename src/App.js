import React, {useRef} from 'react'
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';







function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  return (
    <div className="App">
    <header className="App-header">
      <Webcam mirrored={true}
        ref={webcamRef}
        // style={{
        //   position: "absolute",
        //   marginLeft: "auto",
        //   marginRight: "auto",
        //   left: 0,
        //   right: 0,
        //   textAlign: "center",
        //   zindex: 9,
        //   width: 640,
        //   height: 480,
        // }}
      />

      <canvas
        ref={canvasRef}
        // style={{
        //   position: "absolute",
        //   marginLeft: "auto",
        //   marginRight: "auto",
        //   left: 0,
        //   right: 0,
        //   textAlign: "center",
        //   zindex: 9,
        //   width: 640,
        //   height: 480,
        // }}
      />
      <Button variant="primary">Primary</Button>{' '}
    <Button variant="secondary">Secondary</Button>{' '}
    <Button variant="success">Success</Button>{' '}
    <Button variant="warning">Warning</Button>{' '}
    <Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
    <Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
    <Button variant="link">Link</Button>
    </header>
  </div>
  
  );
}

export default App;

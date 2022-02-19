import React, {useRef} from 'react'
import Webcam from 'react-webcam';
import './App.css';







function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  return (
    <div className="App">
    <header className="App-header">
      <Webcam mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
      {/* <button style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 60,
          right: 0,
          textAlign: "right",
          zindex: 9,
          width: 50,
          height: 50,
        }}>Default</button>; */}
    </header>
  </div>
  
  );
}

export default App;

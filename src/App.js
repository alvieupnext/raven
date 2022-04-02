import React, { useRef } from 'react'
import Container from 'react-bootstrap/Container';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Drone } from './drone';


function App() {



  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <p className="text-justify" id="appLog">Welcome To Raven!</p>
          <Drone ></Drone>
          <iframe src= "http://localhost:5000/index.html" name="targetframe" title="test" allowTransparency="true" scrolling="no" frameborder="0" ></iframe>

        </Container>


      </header>
    </div>

  );
}

export default App;

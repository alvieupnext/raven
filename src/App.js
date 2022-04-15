import React from 'react'
import Container from 'react-bootstrap/Container';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Drone } from './client/drone';


function App() {



  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <p className="text-justify" id="appLog">Welcome To Raven!</p>
          <Drone ></Drone>
        </Container>


      </header>
    </div>

  );
}

export default App;

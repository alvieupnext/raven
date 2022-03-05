
//drone module which takes care of communications with drone
import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { sendToServer } from './server';
import Slider from '@mui/material/Slider';
import { Subscription } from './raven';
import { loadModel } from './streams';
const {logToApp, marks } = require("./Utilities");

function Drone(props) {
    const [takeoff, setTakeoff] = useState(false)
    const [strength, setStrength] = useState(20)
    const [history, setHistory] = useState([])
    const [loaded, setLoaded] = useState(false)
    //could also be changed to 5
    const counter = useRef(3)
    const webcamRef = props.webcam
    const canvasRef = props.canvas

    function addToHistory(command){
        setHistory(history.concat(command))
    }

    function droneLog(history, amount) {
        let upperEnd = history.length
        let lowerEnd = (upperEnd > amount ? upperEnd - amount : 0)
        let result = ""
        for (let i = lowerEnd; i < upperEnd; i++) {
            let element = history[i]
            let name = element.name
            let strength = (element.strength !== undefined ? "_" + element.strength : "")
            result = result + name + strength + " | "
        }
        return result.substring(0, result.length - 3)
    }



    function processCommand(command) {
        if (!takeoff) { //drone on the ground
            console.log(counter)
            if (command.name === "takeOff") {
                sendToServer(command)
                addToHistory(command)
                setTakeoff(true)
            }
            if (typeof command.name === 'number' && counter.current === command.name) { //takeoff sequence?
                logToApp(counter.current, "appLog")
                counter.current -= 1
                if (counter.current === 0) {
                    sendToServer({ name: 'takeOff' })
                    addToHistory({ name: 'takeOff' })
                    setTakeoff(true)
                    counter.current = 3
                }
            }
            else { counter.current = 3 }
        }
        else {
            if (command.name === "land" || command.name === 'emergencyLand') {
                setTakeoff(false)
                sendToServer(command)
            }

            addToHistory(command)
        }
    }
    function sendToDrone(commands) {
        if (commands.length === 1) { //just send the command to the drone
            processCommand(commands[0])
        }

    }

    const history_text = <div>
        <p className="fs-3" >Tello Command History:</p>
        <p className="fs-4" id="telloLog">{droneLog(history, 5)}</p>
        </div>
    
    const sub = <Subscription webcam={webcamRef} canvas={canvasRef} send={sendToDrone}/>


    return (
        (takeoff ?
            <Container>
                {sub}
                <Button variant="danger" onClick={e => sendToDrone([{ name: 'emergencyLand' }])}>Land</Button>
                <Button variant="light" onClick={e => sendToDrone([{ name: 'forward' , strength: strength}])}>Send Drone Forward</Button>
                {history_text}
                <p className="fs-5" >Distance performed by direction:</p>
                <Slider defaultValue={20} step={5} min={20} max={500} onChangeCommitted={(event, value) => setStrength(value)} marks={marks} id="Strength" valueLabelDisplay="auto" color="secondary" />
            </Container>
            :
            <Container>
                {sub}
                <Button variant="primary" onClick={e => sendToDrone([{ name: 'takeOff' }])}>TakeOff</Button>
                {history_text}
            </Container>
        )
    )
}





export { Drone }
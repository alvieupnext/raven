
//drone module which takes care of communications with drone
import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { sendToServer } from './server';
import Slider from '@mui/material/Slider';
import { Subscription } from './raven';
const {logToApp, marks, logDroneHistory, droneLog } = require("./Utilities");

function Drone(props) {
    const takeoff = useRef(false)
    const strength = useRef(20)
    const [trick, reTrick] = useState(false)
    const history = useRef([])
    const [loaded, setLoaded] = useState(false)
    //could also be changed to 5
    const counter = useRef(3)
    const webcamRef = props.webcam
    const canvasRef = props.canvas

    function setTakeoff(bool){
        takeoff.current = bool
        //needed to force a re-render while maintaing this state
        reTrick(!trick)
    }

    function setStrength(number){
        strength.current = number
    }


    function addToHistory(command){
        console.log(history)
        history.current.push(command)
    }

    const directions = ["up", "left", "right", "down", "forward", "back"]



    function processCommand(command) {
        console.log(takeoff)
        if (!takeoff.current) { //drone on the ground
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
        else { //airborne
            if (command.name === "land" || command.name === 'emergencyLand') {
                sendToServer(command)
                setTakeoff(false)  
            }
            else {
                if (directions.includes(command.name)){ //check if direction
                    command.strength = strength.current
                    sendToServer(command)
                }
                else if (typeof command.name === 'number'){ //number
                    command.strength = command.name * 10
                    command.name = 'speed'
                    sendToServer(command)
                }
            }

            addToHistory(command)
        }
    }
    function sendToDrone(commands) {
        if (commands.length === 1) { //just send the command to the drone
            delete commands[0].score
            delete commands[0].hand
            processCommand(commands[0])
            logDroneHistory(history.current)
        }
    }

    const history_text = <div>
        <p className="fs-3" >Tello Command History:</p>
        <p className="fs-4" id="telloLog">{droneLog(history.current, 5)}</p>
        </div>
    
    const [sub, setSub] = useState(<Subscription webcam={webcamRef} canvas={canvasRef} send={sendToDrone} />)


    return (
        (takeoff.current ?
            <Container>
                {sub}
                <Button variant="danger" onClick={e => sendToDrone([{ name: 'emergencyLand' }])}>Land</Button>
                <Button variant="light" onClick={e => sendToDrone([{ name: 'forward'}])}>Send Drone Forward</Button>
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
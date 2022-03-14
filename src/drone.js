
//drone module which takes care of communications with drone
import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { getBattery, sendToServer} from './server';
import Slider from '@mui/material/Slider';
import { Subscription } from './raven';
import { BatteryIndicator } from 'battery-indicator-element';
const { logToApp, logDroneHistory, droneLog, distanceMarks, degreeMarks } = require("./Utilities");

function Drone(props) {
    const takeoff = useRef(false)
    const strength = useRef(20)
    const degree = useRef(90)
    const [battery, setBattery] = useState("0")
    const [trick, reTrick] = useState(false)
    const history = useRef([])
    //could also be changed to 5
    const counter = useRef(3)
    const webcamRef = props.webcam
    const canvasRef = props.canvas
    

    function setTakeoff(bool) {
        takeoff.current = bool
        //needed to force a re-render while maintaing this state
        reTrick(bool)
    }

    function setStrength(number) {
        strength.current = number
    }

    function setDegree(number){
        degree.current = number
    }

    setInterval(() => {setBattery(getBattery())}, 10000)

    function addToHistory(command) {
        console.log(history)
        history.current.push(command)
    }

    const directions = ["up", "left", "right", "down", "forward", "back"]

    const rotations = ['yawCW', 'yawCCW']


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
                setTakeoff(false)
            }
            else {
                if (directions.includes(command.name)) { //check if direction
                    command.arg = strength.current
                    
                }
                else if (rotations.includes(command.name)){
                    command.arg = degree.current
                }
                else if (typeof command.name === 'number') { //number
                    command.arg = command.name * 10
                    command.name = 'setSpeed'
                }
            }
            sendToServer(command)
            addToHistory(command)
        }
    }
    function sendToDrone(command) {
        processCommand(command)
        logDroneHistory(history.current)
    }

    const history_text = <div>
        <p className="fs-3" >Tello Command History:</p>
        <p className="fs-4" id="telloLog">{droneLog(history.current, 5)}</p>
    </div>

    const sub = <Subscription webcam={webcamRef} canvas={canvasRef} send={sendToDrone} />


    return (
        (takeoff.current ?
            <Container>
                {sub}
                <p className="fs-3" >Battery: {battery}</p>
                <Button variant="danger" onClick={e => sendToDrone({ name: 'emergencyLand' })}>Land</Button>
                <Button variant="light" onClick={e => sendToDrone({ name: 'yawCW' })}>Rotate</Button>
                <Button variant="light" onClick={e => sendToDrone({ name: 'forward' })}>Go Forward</Button>
                {history_text}
                <p className="fs-5" >Distance performed by direction:</p>
                <Slider defaultValue={20} step={5} min={20} max={500} onChangeCommitted={(event, value) => setStrength(value)} marks={distanceMarks} id="Strength" valueLabelDisplay="auto" color="secondary" />
                <Slider defaultValue={90} step={1} min={0} max={360} onChangeCommitted={(event, value) => setDegree(value)} marks={degreeMarks} id="Strength" valueLabelDisplay="auto" />


            </Container>
            :
            <Container>
                {sub}
                <p className="fs-3" >Battery: {battery}</p>
                <Button variant="primary" onClick={e => sendToDrone({ name: 'takeOff' })}>TakeOff</Button>
                {history_text}
            </Container>
        )
    )
}





export { Drone}
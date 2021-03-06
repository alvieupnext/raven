//drone module which takes care of communications with drone
import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { batteryStream, sendToServer, statusStream } from './bridge';
import Slider from '@mui/material/Slider';
import { Subscription } from './subscription';
import { MAX_DISTANCE, SAFE_MODE, SEQUENCE, START_DEGREE, START_DISTANCE, START_SPEED } from './settings';
const { logToApp, logDroneHistory, droneLog, distanceMarks, degreeMarks, commandLog, speedMarks } = require("./utilities");

function Drone(props) {
    //default values that can be changed in the UI
    const takeoff = useRef(false)
    const distance = useRef(START_DISTANCE)
    const degree = useRef(START_DEGREE)
    const speed = useRef(START_SPEED)
    //toggle for safe mode
    const safe = useRef(false)
    const [safeBox, setSafeBox] = useState(SAFE_MODE)
    //toggle for sending a command
    const send = useRef(true)
    const [sendColor, setSendColor] = useState(false)
    //sequencer
    const sequence = useRef(SEQUENCE)
    const [battery, setBattery] = useState("0")
    const [color, setColor] = useState("#282c34")
    const [trick, reTrick] = useState(0)
    const history = useRef([])
    //could also be changed to 5
    const counter = useRef(3)

    //setters for our constants
    function setSafe(bool){
        safe.current = bool
        setSafeBox(bool)
    }

    function setSend(bool){
        send.current = bool
        setSendColor((bool ? "green" : "red"))
    }

    function setSequence(bool){
        sequence.current = bool
    }


    function setTakeoff(bool) {
        takeoff.current = bool
        //set send to false
        setSend(false)
        //needed to force a re-render while maintaing this state
        reTrick((trick + 1) % 4)
    }

    function setDistance(number) {
        distance.current = number
    }

    function setDegree(number) {
        degree.current = number
    }

    function setSpeed(number){
        speed.current = number
        sendToDrone({name: "setSpeed", arg: number})
    }

    function addToHistory(command) {
        console.log(history)
        history.current.push(command)
    }

    //function for processing the command confirmations 
    function processStatus(msg){
        if (msg === "ok"){
            setColor("green")
            
        }
        else {setColor("red")}
        //if received message from drone (either ok or err), allow another command to be sent
        setSend(true)
        setTimeout(() => setColor("#282c34"), 1000)
    }

    //subscribers for events
    let batterySubscriber = {
        next: (data) => { setBattery(data); },
        error: (error) => { console.log(error) },
        complete: () => { console.log('Completed') }
    }

    let messageSubscriber = {
        next: (data) => { processStatus(data);},
        error: (error) => { console.log(error) },
        complete: () => { console.log('Completed') }
    }

    let telloSubscriber = {
        next: (data) => { console.log(data); logToApp(commandLog(data), "appLog"); sendToDrone(data.value) },
        error: (error) => { console.log(error) },
        complete: () => { console.log('Completed') }
    }

    //subscribe to the battery and status stream instantly
    batteryStream.subscribe(batterySubscriber)

    statusStream.subscribe(messageSubscriber)

    const directions = ["up", "left", "right", "down", "forward", "back"]

    const rotations = ['yawCW', 'yawCCW']

    function sendToTello(command){
        if (command.name === "stop" || command.name === "emergencyLand" || command.name === "land"){ //do not await confirmation for these commands
            setSend(true)
            sendToServer(command)
            addToHistory(command)
        } 
        //if either safe mode disabled or safe mode enabled with send enabled, perform command
        else if (!safe.current || send.current){
            sendToServer(command)
            addToHistory(command)
            setSend(false)
        }
    }


    function processCommand(command) {
        if (!takeoff.current) { //drone on the ground
            if (command.name === "takeOff") {
                sendToTello(command)
                setTakeoff(true)
            }
            if (typeof command.name === 'number' && counter.current === command.name) { //takeoff sequence?
                logToApp(counter.current, "appLog")
                counter.current -= 1
                if (counter.current === 0) {
                    logToApp("Taking off!", "appLog")
                    sendToTello({ name: 'takeOff' })
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
                    command.arg = distance.current

                }
                else if (rotations.includes(command.name)) {
                    command.arg = degree.current
                }
                else if (typeof command.name === 'number') { //number
                    if (!sequence.current){ //if sequences are disabled, return 
                        return;
                    }
                    command.arg = command.name
                    command.name = 'sequence'
                }
            }
            sendToTello(command)
        }
    }
    function sendToDrone(command) {
        if (command.name === "sequenceToggle"){
            if (!safe.current || send.current){
                if (sequence.current){ 
                    setSequence(false)
                    setSend(false)
                    logToApp("Disabled sequences", "appLog")
                }
                else {
                    setSequence(true)
                    setSafe(true)
                    setSend(false)
                    logToApp("Enabled sequences", "appLog")
                }
                //Allow 2 seconds of delay between sequence toggles
                setTimeout(() => setSend(true), 2000)
            }
        }
        else {
            processCommand(command)
            logDroneHistory(history.current)
        }
    }

    const history_text = <div>
        <p className="fs-3" >Tello Command History:</p>
        <p className="fs-4" id="telloLog">{droneLog(history.current, 5)}</p>
    </div>

    const sub = <Subscription sub={telloSubscriber} />

    const safeButton = (safeBox ?  <div className= {"box " + sendColor}> <p className="fs-6"> </p><p className="fs-6">{(send.current ? "ready" : "busy")}</p></div> : <div></div>)

    return (
        (takeoff.current ?
            <Container>
                {sub}
                <p className="fs-3" >Battery: {battery}</p>
                <div className= {`box ${color}`}>
                <p className="fs-6"> </p>
                <p className="fs-6">command status</p>
                </div>
                <Button variant="danger" onClick={e => {sendToDrone({name: "stop"}); sendToDrone({ name: 'emergencyLand' }); }}>Land</Button>
                <Button variant="light" onClick={e => sendToDrone({ name: 'yawCW' })}>Rotate</Button>
                <Button variant="warning" onClick={e => sendToDrone({ name: 'stop' })}>Stop</Button>
                <Button variant='info' onClick={e => setSafe(!safe.current)}>Toggle Safe Mode</Button>
                <Button variant="danger" onClick={e => sendToDrone({name: "emergency"})}>EMERGENCY LANDING</Button>
                {history_text}
                {safeButton}
                <p className="fs-5" >Distance performed by direction:</p>
                <Slider defaultValue={distance.current} step={5} min={20} max={MAX_DISTANCE} onChangeCommitted={(event, value) => setDistance(value)} marks={distanceMarks} valueLabelDisplay="auto" color="secondary" />
                <p className="fs-5" >Rotation in degrees:</p>
                <Slider defaultValue={degree.current} step={1} min={0} max={360} onChangeCommitted={(event, value) => setDegree(value)} marks={degreeMarks} valueLabelDisplay="auto" />
                <p className="fs-5" >Speed of drone:</p>
                <Slider defaultValue={speed.current} step={1} min={10} max={100} onChangeCommitted={(event, value) => setSpeed(value)} marks={speedMarks} valueLabelDisplay="auto" color="primary"/>
                <iframe src= "http://localhost:5000/index.html" name="targetframe" title="test" height="480" width="640" allowTransparency="true" scrolling="no" frameBorder="0" ></iframe>
            </Container>
            :
            <Container>
                {sub}
                <p className="fs-3" >Battery: {battery}</p>
                <Button variant="primary" onClick={e => sendToDrone({ name: 'takeOff' })}>TakeOff</Button>
                {history_text}
                <iframe src= "http://localhost:5000/index.html" name="targetframe" title="test" height="480" width="640" allowTransparency="true" scrolling="no" frameBorder="0" ></iframe>
            </Container>
        )
    )
}

export { Drone }
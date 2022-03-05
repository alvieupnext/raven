
//drone module which takes care of communications with drone
import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { sendToServer } from './server';
import Slider from '@mui/material/Slider';
const { logDroneHistory, logToApp, marks } = require("./Utilities");


let history = []
//could also be changed to 5
let counter = 3;

function Drone(props) {
    const [takeoff, setTakeoff] = useState(false)
    const [strength, setStrength] = useState(20)

    function processCommand(command) {
        if (!takeoff) { //drone on the ground
            if (command.name === "takeOff") {
                sendToServer(command)
                history.push(command)
                setTakeoff(true)
            }
            if (typeof command.name === 'number' && counter === command.name) { //takeoff sequence?
                logToApp(counter, "appLog")
                counter -= 1
                if (counter === 0) {
                    sendToServer({ name: 'takeOff' })
                    history.push({ name: 'takeOff' })
                    setTakeoff(true)
                    counter = 3
                }
            }
            else { counter = 3 }
        }
        else {
            if (command.name === "land" || command.name === 'emergencyLand') {
                setTakeoff(false)
                sendToServer(command)
            }

            history.push(command)
        }
    }
    function sendToDrone(commands) {
        if (commands.length === 1) { //just send the command to the drone
            processCommand(commands[0])
            logDroneHistory(history)
        }

    }


    return (
        (takeoff ?
            <div>
                <p className="fs-3" >Tello Command History:</p>
                <p className="fs-4" id="telloLog"></p>
                <Button variant="danger" onClick={e => sendToDrone([{ name: 'emergencyLand' }])}>Land</Button>
                <p className="fs-5" >Distance performed by direction:</p>
                <Slider defaultValue={20} step={5} min={20} max={500} onChangeCommitted={(event, value) => setStrength(value)} marks={marks} id="Strength" valueLabelDisplay="auto" color="secondary" />
            </div>
            :
            <div>
                <Button variant="primary" onClick={e => sendToDrone([{ name: 'takeOff' }])}>TakeOff</Button>
            </div>
        )
    )
}





export { Drone }
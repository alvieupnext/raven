
//drone module which takes care of communications with drone
import React, { useRef, useState } from 'react'
import { sendToServer } from './server';
const { logDroneHistory, logToApp } = require("./Utilities");



let history = []

let takeoff = false

//could also be changed to 5
let counter = 3;

function processCommand(command) {
    if (!takeoff) { //drone on the ground
        if (command.name ==="takeOff"){
            sendToServer(command)
            history.push(command)
            takeoff = true
        }
        if (typeof command.name === 'number' && counter === command.name) { //takeoff sequence?
            logToApp(counter, "appLog")
            counter -= 1
            if (counter === 0) {
                sendToServer({name: 'takeOff'})
                history.push({name: 'takeOff'})
                takeoff = true
                counter = 3
            }
        }
        else { counter = 3 }
    }
    else {
        if (command.name === "land" || command.name === 'emergencyLand'){
            takeoff = false
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

export { sendToDrone, takeoff }
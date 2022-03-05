
//drone module which takes care of communications with drone

const { logDroneHistory, logToApp } = require("./Utilities");

let history = []

let takeoff = false

let ws = new WebSocket('ws://localhost:4000/ws')
ws.onopen = function () {

    // Web Socket is connected, send data using send()
    console.log("Server is Open");
};
ws.onmessage = function (evt) {
    var received_msg = evt.data;
    console.log("Message is received..." + received_msg);
};

ws.onclose = function () {

    // websocket is closed.
    console.log("Connection is closed...");
};

//could also be changed to 5
let counter = 3;

function processCommand(command) {
    if (!takeoff) { //drone on the ground
        if (command.name ==="takeOff"){
            ws.send(command)
            history.push(command)
            takeoff = true
        }
        if (typeof command.name === 'number' && counter === command.name) { //takeoff sequence?
            logToApp(counter, "appLog")
            counter -= 1
            if (counter === 0) {
                ws.send({name: 'takeOff'})
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
            ws.send(command)
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
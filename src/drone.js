
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
    history.push(command)
    if (!takeoff) {
        if (typeof command.name === 'number' && counter === command.name) { //takeoff sequence?
            logToApp(counter, "appLog")
            counter -= 1
            if (counter === 0) {
                history.push({ name: 'takeoff' })
                takeoff = true
                counter = 3
            }
        }
        else { counter = 3 }
    }
}



function sendToDrone(commands) {
    if (commands.length === 1) { //just send the command to the drone
        processCommand(commands[0])
        logDroneHistory(history)
    }

}

export { sendToDrone }
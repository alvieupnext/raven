
//drone module which takes care of communications with drone

const { logDroneHistory } = require("./Utilities");

let history = []

let takeoff = false

let ws = new WebSocket('ws://localhost:4000/ws')
ws.onopen = function() {
                
  // Web Socket is connected, send data using send()
  console.log("Server is Open");
};
ws.onmessage = function (evt) { 
var received_msg = evt.data;
console.log("Message is received..." + received_msg);
};

ws.onclose = function() { 

// websocket is closed.
console.log("Connection is closed..."); 
};

function processCommand(command){
    history.push(command)
}



function sendToDrone(commands){
    if (commands.length === 1){ //just send the command to the drone
        processCommand(commands[0])
        logDroneHistory(history)
    }

}

export {sendToDrone}
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

function sendToServer(command){
    if (command.arg === undefined){
        ws.send(command.name)
    }
    else ws.send(`${command.name}_${command.arg}`)
}

export {sendToServer}
let ws = new WebSocket('ws://localhost:4000/ws')
let battery = "0"

function getBattery(){
    return battery
}
ws.onopen = function () {
    // Web Socket is connected, send data using send()
    console.log("Server is Open");
};

//battery
ws.onmessage = function (evt){
    const msg = evt.data
    const received_msg = JSON.parse(msg);
    const bat = received_msg.content
    console.log("Message is received..." + bat);
    console.log(typeof bat)
    battery = bat
}

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

export {sendToServer, getBattery}
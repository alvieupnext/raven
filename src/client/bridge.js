import {Subject} from "rxjs"
let ws = new WebSocket('ws://localhost:4000/ws')

const batteryStream = new Subject()

const statusStream = new Subject()

ws.onopen = function () {
    // Web Socket is connected, send data using send()
    console.log("Server is Open");
};



//battery and event confirmations
ws.onmessage = function (evt){
    const msg = evt.data
    const received_msg = JSON.parse(msg);
    const content = received_msg.content
    if (typeof content === "object"){
        console.log(received_msg.type)
        console.log(JSON.stringify(content))
    }
    console.log("Received " + content)
    switch (received_msg.type){
        case "battery": batteryStream.next(content)
                        break;
        case "message": statusStream.next(content)
        break;
        default: console.log(content)
    } 
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

export {sendToServer, batteryStream, statusStream}
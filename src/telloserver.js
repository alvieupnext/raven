const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//prepare to serve static files for the mediapipe model
app.use(express.static(__dirname + '/mediapipe'))

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const { TelloDrone } = require('yatsw')

const argdict = {
    left: [1],
    right: [1],
}

//store battery in this variable
let battery = 0;

wss.on('connection', (ws) => {

    const Tello = new TelloDrone()

    Tello.start()

    Tello.streamOn()

    // //events
    // Tello.on(Tello.events.VIDEO, data => {
    //     console.log(data)
    // })


    //telemetry
    Tello.on(Tello.events.STATE, data => {
        let parsed = JSON.parse(data)
        // console.log(parsed)
        if (battery !== parsed.bat){ //update battery variable and send new battery value to server
            ws.send(parsed.bat)
            battery = parsed.bat
        }
        
    })

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        // console.log(message.toString())
        const index = message.indexOf('_')
        if (index === -1){ //no parameter
            if (message === "stop"){
                //empty the command
                Tello.commands = []
                Tello._send("stop")
            }
            else {
            let func = Tello[message]
            func()
            }
        }
        else {
            let name = message.substring(0, index)
            let func = Tello[name]
            let arg = message.substring(index + 1)
            console.log(arg)
            console.log(name)
            if (name === "flip"){
                func(arg)
            } 
            else {
                func(parseInt(arg))
            }
        }
        const func = Tello[message.toString()]
        // const arg = argdict[message.toString()]
        // console.log(func)
        // if (arg !== undefined){
        //     func.apply(null, arg)
        // }
        // else {func()}
    });
});

//start our server
server.listen(4000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
// const { TelloDrone } = require('yatsw')

// const tello = new TelloDrone()

// let ws = new WebSocket.Server({port:4000})

// // ws.start()

// tello.start()

// function sendToTello(commands){
//   return "hi"
// }
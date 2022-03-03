const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const { TelloDrone } = require('yatsw')

const Tello = new TelloDrone()

Tello.start()

const argdict = {
    left: [1],
    right: [1],
}

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        console.log(message)
        console.log(message.toString())
        const func = Tello[message.toString()]
        const arg = argdict[message.toString()]
        console.log(func)
        if (arg !== undefined){
            func.apply(null, arg)
        }
        else {func()}
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
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
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const presets  = require('./presets');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//prepare to serve static files for the mediapipe model
app.use(express.static(__dirname + '/mediapipe'))

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const { TelloDrone } = require('./yatsw')

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
            let msg = {type: 'battery', content: parsed.bat}
            ws.send(JSON.stringify(msg))
            battery = parsed.bat
        }
    })

    Tello.on(Tello.events.MESSAGE, data => {
        if (typeof data !== "object"){
            let msg = {type: 'message', content: data}
            ws.send(JSON.stringify(msg))
        }
    })

    function process(message){
        const index = message.indexOf('_')
        if (index === -1){ //no parameter
            if (message === "stop"){
                //empty the command
                Tello.commands = []
                Tello._send("stop")
            }
            else {
            let func = Tello[message]
            return func()
            }
        }
        else {
            let name = message.substring(0, index)
            let arg = message.substring(index + 1)
            if (name === "sequence"){ 
               let sequence = presets[arg]
               for (let command of sequence){
                   process(command)
               }
               let msg = {type: 'message', content: "ok"}
               ws.send(JSON.stringify(msg))
            }
            else {
                let func = Tello[name]
                console.log(arg)
                console.log(name)
                if (name === "flip"){
                    return func(arg)
                } 
                else {
                    return func(parseInt(arg))
                }
                

            }
        }

    }
    

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        // console.log(message.toString())
        process(message)
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
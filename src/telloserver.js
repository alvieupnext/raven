const { TelloDrone } = require('yatsw')

const tello = new TelloDrone()

let ws = new WebSocket.Server({port:4000})

// ws.start()

tello.start()

function sendToTello(commands){
  return "hi"
}
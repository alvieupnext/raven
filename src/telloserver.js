const { TelloDrone } = require('yatsw')

const tello = new TelloDrone()

tello.start()

function sendToTello(commands){
  return "hi"
}
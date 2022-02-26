import * as mp from '@mediapipe/hands'
import * as du from '@mediapipe/drawing_utils'

const refreshRate = 60

function drawHand (results, canvasElement) {
    const canvasCtx = canvasElement.current.getContext("2d")
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        du.drawConnectors(canvasCtx, landmarks, mp.HAND_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 5});
        du.drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
      }
    }
    canvasCtx.restore();
  }

// logs a message to the application and also logs it to the console
function logToApp(message) {
    document.getElementById("appLog").innerHTML = message
    console.log(message)
};

// mirrors direction
function mirrorDirection(dir){
    return (dir === 'Right' ? 'Left' : "Right")
   }

//combines one or multiple commands into one single string
function commandLog(data){
    let result = ""
    switch (data.origin){
        case "gesture": for (let value of data.value){
            result = result + `Gesture ${value.gesture} from ${value.hand} hand || `
        }
        break;
        case "command": for (let value of data.value){
            result = result + `Command ${value.command} from ${value.hand} hand || `
        } 
        break;
        case "frequency": for (let freq of data.value){
            result = result + `Command ${freq.name} from ${freq.hand} with score ${freq.score} || `
        }
        ;break
        //for minimal export and unimplemented origins
        default: for (let value of data.value){
            result = result + JSON.stringify(value) + ' || '
        }
    }
    
    //remove the last vertical lines from end result
    return result.substring(0, result.length - 3)

}


//sets an attribute to a new value and returns the json
function setJSON(json, att, value) {
    json[att] = value;
    return json;
}

//dereferences a json, creating a clone of a json object
function dereference(json) {
    // return json
    return { ...json }
}

function setOrigin(json, origin) {
    return setJSON(json, 'origin', origin)
}

function setValue(json, value){
    return setJSON(json, 'value', value)
}

function transformValue(json, transform) {
    return setJSON(json, 'value', transform(json['value']))
}



// eslint-disable-next-line import/no-anonymous-default-export
export { logToApp, setJSON, dereference, refreshRate, setOrigin, transformValue, commandLog, drawHand, mirrorDirection, setValue}
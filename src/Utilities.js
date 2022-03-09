import * as mp from '@mediapipe/hands'
import * as du from '@mediapipe/drawing_utils'

const refreshRate = 60

function drawHand(results, canvasElement) {
    const canvasCtx = canvasElement.current.getContext("2d")
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            du.drawConnectors(canvasCtx, landmarks, mp.HAND_CONNECTIONS,
                { color: '#00FF00', lineWidth: 5 });
            du.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
    canvasCtx.restore();
}

// logs a message to the application and also logs it to the console
function logToApp(message, id) {
    document.getElementById(id).innerHTML = message
    console.log(message)
};

// mirrors direction
function mirrorDirection(dir) {
    return (dir === 'Right' ? 'Left' : "Right")
}

const degreeMarks = [
    {
        value: 0,
        label: "0°"
    },
    {
        value: 90,
        label: "90°"
    },
    {
        value: 180,
        label: "180°"
    },
    {
        value: 270,
        label: "270°"
    },
    {
        value: 360,
        label: "360°"
    }
]

const distanceMarks = [
    {
        value: 20,
        label: 'Min = 20cm',
    },
    {
        value: 100,
        label: '1m',
    },
    {
        value: 200,
        label: '2m',
    },
    {
        value: 300,
        label: '3m',
    },
    {
        value: 400,
        label: '4m',
    },

    {
        value: 500,
        label: 'Max = 5m',
    },
];

//combines one or multiple commands into one single string
function commandLog(data) {
    let result = ""
    switch (data.origin) {
        case "gesture": for (let value of data.value) {
            result = result + `Gesture ${value.gesture} from ${value.hand} hand || `
        }
            break;
        case "command": 
            return `Command ${data.value.command} from ${data.value.hand} hand`
        case "frequency": 
            return `Command ${data.value.name} from ${data.value.hand} hand with score ${data.value.score}`
        //for minimal export and unimplemented origins
        default: for (let value of data.value) {
            result = result + JSON.stringify(value) + ' || '
        }
    }

    //remove the last vertical lines from end result
    return result.substring(0, result.length - 3)

}

function droneLog(history, amount) {
    let upperEnd = history.length
    let lowerEnd = (upperEnd > amount ? upperEnd - amount : 0)
    let result = ""
    for (let i = lowerEnd; i < upperEnd; i++) {
        let element = history[i]
        let name = element.name
        let arg = (element.arg !== undefined ? "_" + element.arg : "")
        result = result + name + arg + " | "
    }
    return result.substring(0, result.length - 3)
}


function logDroneHistory(history) {
    logToApp(droneLog(history, 5), "telloLog")
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

function setValue(json, value) {
    return setJSON(json, 'value', value)
}

function transformValue(json, transform) {
    return setJSON(json, 'value', transform(json['value']))
}



// eslint-disable-next-line import/no-anonymous-default-export
export { logToApp, setJSON, dereference, refreshRate, setOrigin, transformValue, commandLog, drawHand, mirrorDirection, setValue, logDroneHistory, distanceMarks, droneLog, degreeMarks}
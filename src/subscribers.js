// subscribers can be used to get information from the pipeline

import { sendToTello } from "./drone";
import { commandLog, logToApp } from "./Utilities";


let consoleSubscriber = {
    next: (data) => { console.log(data);},
    error: (error) => { console.log(error) },
    complete: () => { console.log('Completed') }
}


let logSubscriber = {
    next: (data) => { console.log(data); logToApp(commandLog(data), "appLog")},
    error: (error) => { console.log(error) },
    complete: () => { console.log('Completed') }
}

let telloSubscriber = {
    next: (data) => { console.log(data); logToApp(commandLog(data), "appLog"); logToApp(sendToTello(data.value), "telloLog")},
    error: (error) => { console.log(error) },
    //TODO tello stop
    complete: () => { console.log('Completed') }
}

export {consoleSubscriber, logSubscriber, telloSubscriber}
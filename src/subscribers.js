// subscribers can be used to get information from the pipeline

import { commandLog, logToApp } from "./Utilities";


let consoleSubscriber = {
    next: (data) => { console.log(data);},
    error: (error) => { console.log(error) },
    complete: () => { console.log('Completed') }
}


let logSubscriber = {
    next: (data) => { logToApp(commandLog(data.value))},
    error: (error) => { console.log(error) },
    complete: () => { console.log('Completed') }
}

export {consoleSubscriber, logSubscriber}
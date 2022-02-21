// logs a message to the application and also logs it to the console
function logToApp(message) {
    document.getElementById("appLog").innerHTML = message
    console.log(message)
  };


//sets an attribute to a new value and returns the json
function setJSON(json, att, value){
    json[att] = value;
    return json;
 }

 //dereferences a json, creating a clone of a json object
 function dereference(json) {
    // return json
    return {...json}
  }
 


// eslint-disable-next-line import/no-anonymous-default-export
export default {logToApp, setJSON, dereference}
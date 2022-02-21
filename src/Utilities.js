// logs a message to the application
function logToApp(message) {
    document.getElementById("appLog").innerHTML = message
  };

function setJSON(json, att, value){
    json[att] = value;
    return json;
 }

 function dereference(json) {
    // return json
    return {...json}
  }
 


// eslint-disable-next-line import/no-anonymous-default-export
export default {logToApp, setJSON, dereference}
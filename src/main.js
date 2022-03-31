const { app, BrowserWindow } = require('electron')

require("./telloserver")

require("./videoFeed")

// const http = require('http');
// const WebSocket = require('ws');

// const server = http.createServer(app);

// //initialize the WebSocket server instance
// const wss = new WebSocket.Server({ server });

// const argdict = {
//     left: [1],
//     right: [1],
// }

// const Tello = new TelloDrone()

// wss.on('connection', (ws) => {
//   Tello.start()

//     //connection is up, let's add a simple simple event
//     ws.on('message', (message) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         console.log(message)
//         console.log(message.toString())
//         const func = Tello[message.toString()]
//         const arg = argdict[message.toString()]
//         console.log(func)
//         if (arg !== undefined){
//             func.apply(null, arg)
//         }
//         else {func()}
//         ws.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection    
//     ws.send('Hi there, I am a WebSocket server');

//     ws.on('close', (message) => {
//       console.log("Closed Websocket")
//       Tello.destroy()
//     })
// });

// //start our server
// server.listen(4000, () => {
//     console.log(`Server started on port ${server.address().port} :)`);
// });

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // //load the index.html from a url
  win.loadURL('http://localhost:3000');

  // console.log(__dirname+'/public/')

  // win.loadURL(url.format({
  //   pathname: path.join(__dirname+'/public/', 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  // Open the DevTools.
  win.webContents.openDevTools()
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
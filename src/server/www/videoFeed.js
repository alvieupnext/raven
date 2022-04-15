//changing this code to work 

/*
 * Created on Tue 3/24/2020
 *
 * Copyright (c) 2020 - DroneBlocks, LLC
 * Author: Dennis Baldwin
 * URL: https://github.com/dbaldwin/tello-video-nodejs-websockets
 *
 * PLEASE REVIEW THE README FILE FIRST
 * YOU MUST POWER UP AND CONNECT TO TELLO BEFORE RUNNING THIS SCRIPT
 */

// Import necessary modules for the project
// A basic http server that we'll access to view the stream
const http = require('http');

// To keep things simple we read the index.html page and send it to the client
const fs = require('fs');

// WebSocket for broadcasting stream to connected clients
const WebSocket = require('ws');

// We'll spawn ffmpeg as a separate process
const spawn = require('child_process').spawn;

// HTTP and streaming ports
const HTTP_PORT = 5000;
const STREAM_PORT = 5001

/*
  1. Create the web server that the user can access at
  http://localhost:3000/index.html
*/
const server = http.createServer(function(request, response) {

  // Log that an http connection has come through
  console.log(
		'HTTP Connection on ' + HTTP_PORT + ' from: ' + 
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);

  // Read file from the local directory and serve to user
  // in this case it will be index.html
  fs.readFile(__dirname + request.url, function (err,data) {
    if (err) {
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    response.writeHead(200);
    response.end(data);
  });

}).listen(HTTP_PORT); // Listen on port 5000

/*
  2. Create the stream server where the video stream will be sent
*/
const streamServer = http.createServer(function(request, response) {

  // Log that a stream connection has come through
  console.log(
		'Stream Connection on ' + STREAM_PORT + ' from: ' + 
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);

  // When data comes from the stream (FFmpeg) we'll pass this to the web socket
  request.on('data', function(data) {
    // Now that we have data let's pass it to the web socket server
    webSocketServer.broadcast(data);
  });

}).listen(STREAM_PORT); // Listen for streams on port 5001

/*
  3. Begin web socket server
*/
const webSocketServer = new WebSocket.Server({
  server: streamServer
});

// Broadcast the stream via websocket to connected clients
webSocketServer.broadcast = function(data) {
  webSocketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

/*
  5. Begin the ffmpeg stream. You must have Tello connected first
*/

// Delay for 3 seconds before we start ffmpeg
setTimeout(function() {
  var args = [
    "-i", "udp://0.0.0.0:11111",
    "-r", "30",
    "-s", "640x480",
    "-codec:v", "mpeg1video",
    "-b", "400k",
    "-f", "mpegts",
    "http://127.0.0.1:5001/stream"
  ];
  console.log("started ffmpeg")
  // Spawn an ffmpeg instance
  var streamer = spawn('ffmpeg', args);
  // Uncomment if you want to see ffmpeg stream info
  //streamer.stderr.pipe(process.stderr);
  streamer.on("exit", function(code){
      console.log("Failure", code);
  });
}, 4000);
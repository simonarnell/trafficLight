var wpi = require('wiring-pi');

const arduino_i2c_address = 0x04;
const arduino_file_desc = wpi.wiringPiI2CSetup(arduino_i2c_address);

var currentPhasing = 0;

setInterval(function() { 
  let newPhase = wpi.wiringPiI2CRead(arduino_file_desc)
  if(newPhase != currentPhasing) {
    console.log('new phase from i2c - ' + newPhase)
    currentPhasing = newPhase;
    trafficLightChannel.emit('currentPhase', currentPhasing)
  }
}, 10)

//wpi.wiringPiI2CWrite(arduino_file_desc, 2);
//console.log(wpi.wiringPiI2CRead(arduino_file_desc))

var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var activeConnections = 0;
var totalConnections = 0;

var trafficLightChannel = io.of('/trafficLight').on('connection', function(socket) {
  console.log('A new user connected to the trafficLight channel');
  activeConnections++;
  totalConnections++;
  socket.emit('currentPhase', currentPhasing);
  
  socket.on('newPhase', function(newPhase) {
    if(newPhase != currentPhasing && newPhase >= 0 && newPhase <= 3) {
      console.log('new phase from WebSocket - ' + newPhase)
      wpi.wiringPiI2CWrite(arduino_file_desc, newPhase);
    }
  })
  socket.on('disconnect', function() {
    console.log('A user disconnected from the trafficLight channel');
    activeConnections--;
  });
});

server.listen(8080);

setInterval(function() { 
  console.log(activeConnections + ' active users, ' + totalConnections + ' total users');
}, 5000);
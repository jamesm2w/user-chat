// Use ES6
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');
const UUID = require("node-uuid");

var gameport = process.env.port || 4004;

console.log("Listening...")

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

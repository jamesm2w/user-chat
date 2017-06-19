// Use ES6
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');
const UUID = require("node-uuid");


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = {};

io.on("connection", function (user) {
  var addedUser = false;
  
  user.on("send-message", function (data) {
    
    user.broadcast.emit("recieve-message", {
      user: user.user.name,
      data: data
    });
    
  });
  
});
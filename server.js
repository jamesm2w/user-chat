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

http.listen(3000, () => {
  console.log('listening on *:3000');
});

var users = {};

io.on("connection", function (user) {
  
  user.on("auth", function (data) {
    var userid = new UUID();
    users[userid] = data["name"];
    
    user.emit("connected", userid);
  });
  
  
  
  user.on("send-message", function (data) {
    
    user.broadcast.emit("recieve-message", {
      user: users[data["uuid"]],
      data: data
    });
    
  });
  
});
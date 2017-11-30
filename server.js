// Use ES6
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');

const User = require("./user");

var idCounter = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

var users = [];

io.on("connection", function (user) {
  
  let clientUser;
  
  user.on("auth", function (data, cb) {
    var userid = ++idCounter;
    clientUser = new User(_.assign({
      id: userid,
      name: data["name"]
    }));
    users.push(clientUser);
    
    user.broadcast.emit("joining", {
      name: data["name"]
    });
    
    cb({id: userid});
  });
  
  user.on("send-message", function (data, cb) {
    user.broadcast.emit("recieve-message", {
      name: data["name"],
      data: data["data"]
    });
    cb(data);
  });
  
  user.on("disconnect", function (reason){
    _.remove(users, clientUser);
    console.log("Client Disconnected: " + reason);
    
    if (clientUser == undefined){
      user.broadcast.emit("left", {name:"someone"});
    } else {
      user.broadcast.emit("leaving", {
        name: clientUser.name
      })
    }
  });
});


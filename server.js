// Use ES6
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');

const User = require("./user");

var counter = 0;

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
    counter++;
    var userid = counter;
    clientUser = new User(_.assign({
      id: userid,
      name: data["name"]
    }));
    users.push(clientUser);
    cb({id: userid});
  });
  
  user.on("send-message", function (data) {
    
    user.broadcast.emit("recieve-message", {
      user: users[data["uuid"]],
      data: data
    });
    
  });
  
  user.on("disconnect", function (reason){
    _.remove(users, clientUser);
  });
  
});


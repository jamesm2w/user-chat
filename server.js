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
      name: data["name"],
      icon: data["icon"]
    }));
    users.push(clientUser);
    
    user.broadcast.emit("joining", {
      name: data["name"],
      icon: data["icon"]
    });
    
    user.emit("memberList", users);
    
    cb({id: userid});
  });
  
  user.on("update-member", function (data, cb) {
    let name = data.name, icon = data.icon, uuid = data.uuid, sendObj = {type: "self"};
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == uuid) {
        sendObj.old = users[i];
        users[i].name = name;
        users[i].icon = icon;
        sendObj.new = users[i];
        user.emit("memberList", users);
        
        cb(sendObj);
      }
    }
    cb();
  });
  
  user.on("send-message", function (data, cb) {
    user.broadcast.emit("recieve-message", {
      name: data["name"],
      data: data["data"],
      icon: data["icon"]
    });
    cb(data);
  });
  
  user.on("disconnect", function (reason){
    _.remove(users, clientUser);
    console.log("Client Disconnected: " + reason);
    
    if (clientUser === undefined){
      user.broadcast.emit("left", {name:"someone"});
    } else {
      user.broadcast.emit("leaving", {
        name: clientUser.name,
        icon: clientUser.icon
      });
      //user.broadcase.emit("memberList", users)
    }
  });
});


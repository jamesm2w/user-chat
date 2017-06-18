// Use ES6
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');

let autoId = 0;
let players = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (client) => {
  let player;
  let id;

  client.on('auth', (opts, cb) => {
    id = ++autoId;
    player = id;
    players.push(player);
    // Callback with id
    cb({ id: autoId });
  });
  
  // Receive keystrokes
  client.on('key', (key) => {
    // and change direction accordingly
    if(player) {
      player.changeDirection(key);
    }
  });

  // Remove players on disconnect
  client.on('disconnect', () => {
    _.remove(players, player);
  });
});
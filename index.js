const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stage', (req, res) => {
  res.sendFile(__dirname + '/stage.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('hello', (msg) => {
    console.log('message: ' + msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

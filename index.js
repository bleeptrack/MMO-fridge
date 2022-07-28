const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let stageID = undefined

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stage', (req, res) => {
  res.sendFile(__dirname + '/stage.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  if(stageID){
      let msg = {
         ID: socket.id,
         word: "LAMA"
      }

      io.to(stageID).emit("join", msg);
    }

  socket.on('move', (msg) => {
    console.log('message: ' + msg);
    if(stageID){
        msg.ID = socket.id
        io.to(stageID).emit("move", msg);
    }
  });

  socket.on("stage announcement", function() {
      stageID = socket.id
      console.log("new stage id set: ", socket.id)
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

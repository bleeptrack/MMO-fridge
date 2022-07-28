const { getWordsList } = require('most-common-words-by-language');
const _ = require('lodash');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let stageID = undefined
let wordList = getWordsList('english', 2000);
wordList = _.shuffle(wordList)
let counter = 0

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
         word: wordList[counter]
      }

      counter = (counter+1) % wordList.length
      io.to(stageID).emit("join", msg);
      socket.emit("welcome", msg);
    }

  socket.on("disconnect", (reason) => {
    if(stageID){
      let msg = {
         ID: socket.id
      }

      io.to(stageID).emit("leave", msg);
    }
  });

  socket.on('move', (msg) => {
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

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
let counter2 = 0

let words = [
    "Amiga",
    "Atari",
    "C64",
    "Web",
    "4K",
    "Pixel",
    "aaaa",
    "Compo",
    "Shader",
    "Showdown",
    "Code",
    "Chiptunes",
    "Evoke",
    "Cologne",
    "AbenteuerHallenKALK",
    "Beer",
    "Party",
    "Tracker"
]
words = _.shuffle(words)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

app.get('/stage', (req, res) => {
  res.sendFile(__dirname + '/stage.html');
});

function getWord() {
    if (Math.random() > 0.5) {
        counter = (counter+1) % wordList.length
        return wordList[counter]
    } else {
        counter2 = (counter2+1) % words.length
        return words[counter2]
    }
}

io.on('connection', (socket) => {
  console.log('a user connected');
  if(stageID){
      let msg = {
         ID: socket.id,
         word: getWord()
      }

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

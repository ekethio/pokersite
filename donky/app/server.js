const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const Game = require("./models/game.js");
const { GameStatus } = require("./utils/enums.js");
const Player = require("./models/player.js");

//
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Enable/disable cors (cross-origin resource sharing) if necessary
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get IDs of connected clients
let ids = Object.keys(io.sockets.clients().connected);

// Create actual Game object
const pokerGame = new Game(io);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/game.html");
});
app.use(express.static(__dirname + "/static"));

io.on("connection", (socket) => {
  socket.emit("welcome", {
    players: pokerGame.masterList,
    board: pokerGame.board,
    bb: pokerGame.bigBlind,
  });

  socket.on("join", ({ seat, name, buyin }) => {
    const player = new Player(name, socket.id, buyin, seat);
    pokerGame.addPlayer(player, seat);
    players = pokerGame.masterList;
    io.emit("new user", { players });
    console.log(name + " joined");

    if (  pokerGame.returnPlayers().length > 1 &&
      pokerGame.gameStatus === GameStatus.NOT_STARTED ) {
      pokerGame.startGame(player);
    }
  });
  
  socket.on("action", (action) => {
    pokerGame.currentHand.updateGameState(action);
    io.emit("actionRequested", {
      players: pokerGame.masterList,
      board: pokerGame.currentHand.boardCards,
      maxWager: pokerGame.currentHand.currentMaxWager,
      currentPlayer: pokerGame.currentHand.playerList
        .getCurrentPlayer()
        .getUsername(),
     minLegalRaise: pokerGame.currentHand.currentLegalMinRaise
    });
  });
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 8081;
server.listen(port);

console.log(`listening on: ${port}`);

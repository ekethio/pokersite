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

games = {}



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/game.html");
});
app.use(express.static(__dirname + "/static"));

io.on("connection", (socket) => {
 
  
  socket.on('findTable', ({table}) =>{
       let pokerGame;
       if (table in games){
         pokerGame = games[table];
       }
       else{
        pokerGame  = new Game(io, table)
        games[table] = pokerGame;
       }
    socket.join(table);
    socket.emit("welcome", {
    players: pokerGame.masterList,
    board:pokerGame.currentHand? pokerGame.currentHand.boardCards: [],
    maxWager: pokerGame.currentHand? pokerGame.currentHand.currentMaxWager :0,
    currentPlayer: pokerGame.currentHand? pokerGame.currentHand.playerList
        .getCurrentPlayer()
        .getUsername(): null,
   minLegalRaise:  pokerGame.currentHand? pokerGame.currentHand.currentLegalMinRaise: 0
  });
       
  });

  socket.on("join", ({ seat, table, name, buyin }) => {
    const player = new Player(name, socket.id, buyin, seat);
    const pokerGame = games[table];
    pokerGame.addPlayer(player, seat);
    players = pokerGame.masterList;
  
    io.to(table).emit("new user", { players });
    console.log(name + " joined");

    if (  pokerGame.returnPlayers().length > 1 &&
      pokerGame.gameStatus === GameStatus.NOT_STARTED ) {
      pokerGame.startGame(player);
    }
  });
  
  socket.on("action", ({action, table}) => {
    const pokerGame = games[table];
    pokerGame.currentHand.updateGameState(action);
    io.to(table).emit("actionRequested", {
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

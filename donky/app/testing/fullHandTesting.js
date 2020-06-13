/**
 * THIS IS OUR PRIMARY TEST FILE
 */

// const randomID = require('.././utils/randomID.js');
// const handEval = require('.././utils/handEval.js');
// const Game = require('.././models/game.js');
// const Deck = require('.././models/deck.js');
const Player = require(".././models/player.js");
const Hand = require(".././models/hand.js");

/* *************************** TESTING BELOW HERE ************************** */

const austin = new Player("alim", "ID-snauzaroni", 50);
const tyler = new Player("tfish", "ID-fishdog", 51);
const paul = new Player("pspankles", "ID-spanklestiltskin", 10);
const alston = new Player("alston", "ID-alston", 99);

const players = [];
players.push(austin);
players.push(tyler);
players.push(paul);
players.push(alston);

const hand = new Hand("hand-123456", players, paul.getID(), 5, 1);

hand.playHand();

/* PSEUDOCODE FOR PLAYHAND */

// playersToAct = {id: {currentWager: 0, needsToAct: boolean }};

// while (handIsNotOver):

//   currentStreet = someLogic;

//   while (streetIsNotOver):

//     maxBet = 0;

//     deal the board

//     while (not all players needsToAct bool is false):
//       currentPlayer = this.playersList.getNextPlayer();

//       action = currentPlayer.getAction();

//       updateGameState(action) // goes thru each player in playerList and update their fields
//       // also updates street counter

//       playerToAct[currentPlayer.id].needsToAct = false;

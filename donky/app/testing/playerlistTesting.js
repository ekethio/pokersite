const PlayerList = require(".././models/playerList.js");
const Player = require(".././models/player.js");

const austin = new Player("alim", 1, 500);
const tyler = new Player("tfish", 2, 500);
const paul = new Player("pspankles", 3, 500);
const alston = new Player("alston", 4, 500);

const players = [austin, tyler, paul, alston];

const testList = new PlayerList(players);

console.log("// Should be alim: \n", testList.currentPlayer.userName);

console.log('// should be "tfish": \n', testList.getNextPlayer().userName);

testList.getNextPlayer();
testList.getNextPlayer();

console.log("// should be back to alim: \n", testList.getNextPlayer().userName);

testList.removePlayer(2);

console.log(
  "should be pspankles. tfish was removed, so the next player should be pspankles: \n",
  testList.getNextPlayer().userName
);

testList.setCurrentPlayer(4);
console.log("should log alston: \n", testList.currentPlayer.userName);

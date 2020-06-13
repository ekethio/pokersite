

const Hand = require("./hand.js");
const { GameStatus } = require("../utils/enums.js");


const TABLE_SEATS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

class Game {
  constructor(io) {
 
    this.masterList = Object.assign(
      {},
      TABLE_SEATS.map((seat) => null)
    );
    this.handHistory = [];
    this.results = [];
    this.playerToAct = null;
    this.bigBlind = 2;
    this.board = [];
    this.io = io;
    this.gameStatus = GameStatus.NOT_STARTED;
    this.maxBuyin = null;
    this.minBuyin = null;
    this.currentHand = null;
  }

  async startGame(button) {
 
    this.gameStatus = GameStatus.IN_PROGRESS;
    let handNum = 1;
    let buttonPlayer = button;
   
    while (
      Object.values(this.masterList).filter((player) => player != null).length >
      1
    ) {
      this.currentHand = new Hand(
        Object.values(this.masterList).filter((player) => player != null),
        this,
        this.io,
        this.bigBlind,
        handNum,
        buttonPlayer
      );
      buttonPlayer = await this.currentHand.playHand();
    
      handNum += 1;
    }
    this.gameStatus = GameStatus.NOT_STARTED;
    this.board = [];
    this.io.emit("gameEnded", { players: this.masterList, board: [] });
  }

  endHand() {
    this.currentHand = null;
  }
  returnAllPlayers() {
    return Object.values(this.masterList).filter((player) => player != null);
  }
  returnPlayers() {
    return Object.values(this.masterList)
      .filter((player) => player != null)
      .map((player) => player.username);
  }

  addPlayer(player, seatNumber) {
    this.masterList[seatNumber] = player;
  }

  updateHandHistory(hand) {
    this.handHistory.add(hand);
  }

  getHand(id) {
    return this.handHistory[id];
  }

  updateResults() {
    let currPlayer = this.masterList.getHead();
    for (let i = 0; i < this.masterList.sizeOfList(); i++) {
      this.results.push({
        name: currPlayer.getName(),
        result: currPlayer.getCurrentResult(),
      });
      currPlayer = currPlayer.getNext();
    }
  }

  setBigBlind(blind) {
    this.bigBlind = blind;
  }
  getTable() {
    return this.masterLIst;
  }

  getBigBlind() {
    return this.bigBlind;
  }

  setMax(max) {
    this.maxBuyin = max;
  }

  getMax() {
    return this.maxBuyin;
  }

  setMin(min) {
    this.minBuyin = min;
  }

  getMin() {
    return this.minBuyin;
  }
}

// Export this class
module.exports = Game;

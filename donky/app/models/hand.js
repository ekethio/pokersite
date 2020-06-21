

const Action = require("./action.js");
const PlayerList = require("./playerList.js");
const Deck = require("./deck.js");
const { Streets, Actions } = require(".././utils/enums.js");
const { calculatePots } = require(".././utils/calculatePots.js");
const { rankPlayers } = require("../utils/handEval.js");
const { assignAllPots } = require(".././utils/assignPots.js");



class Hand {
  constructor(players, game, table, io, bigBlindAmount, handNum, buttonPlayer) {
    this.HAND_ID = handNum;
    this.table = table;
    this.players = [...players];
    this.playerList = new PlayerList(players, buttonPlayer);
    this.BIG_BLIND = bigBlindAmount;
    this.buttonPlayer =buttonPlayer;
    this.bigBlindPlayer = this.playerList.getPreviousPlayer();
    this.smallBlindPlayer = this.playerList.setPreviousPlayer().getPreviousPlayer(); 
    this.playerList.setNextPlayer();
    this.MIN_CHIP_VALUE = 1;  
    this.deck = new Deck(); 
    this.game = game;
    this.boardCards = [];
    this.io = io;
    this.street = Streets.PREFLOP;
    this.currentMaxWager = bigBlindAmount;
    this.currentLegalMinRaise = this.BIG_BLIND;
    this.playersAllInThisHand = []; 
    this.playersAllInThisStreet = []; 
    this.playersFoldedThisStreet = []; 
    this.playersFoldedThisHand = []; 
    this.activePot = 0; 
    this.sidepots = []; 
  }

  dealHoleCards() {
    this.playerList.players.forEach((player) => {
      const holeCards = [this.deck.dealCard(), this.deck.dealCard()];
      player.setHoleCards(holeCards);
    });
  }

  
  dealCards(numberOfCards) {
    let cardsDealt = 0;

    while (cardsDealt < numberOfCards) {
      const card = this.deck.dealCard();
      this.boardCards.push(card);
      this.game.board.push(card);
      cardsDealt += 1;
    }
  }

  // Move from preflop->flop->turn->river
  goToNextStreet() {
    switch (this.street) {
      case Streets.PREFLOP: {
        this.street = Streets.FLOP;
        break;
      }
      case Streets.FLOP: {
        this.street = Streets.TURN;
        break;
      }
      case Streets.TURN: {
        this.street = Streets.RIVER;
        break;
      }
      case Streets.RIVER: {
        this.street = null;
        break;
      }
      default: {
        throw new Error("INVALID STREET");
      }
    }
  }


  dealStreet() {
    switch (this.street) {    
      case Streets.FLOP: {
        this.dealCards(3);    
        break;
      }   
      case Streets.TURN: {
        this.dealCards(1 ); 
        break;
      } 
      case Streets.RIVER: {
        this.dealCards(1);  
        break;
      } 
      default: {
        console.log("(No cards need to be dealt right now)");
        break;
      }
    }
  }

  
  async dealRemainingBoardCards() {
    while (this.boardCards.length < 5) {
      this.dealCards(1)
      this.io.to(this.table).emit("run out", {
        players: this.game.masterList,
        board: this.boardCards,
      });
      if (this.boardCards.length > 2) {
        await this.sleep(1000);
      }
    }
    await this.sleep(1000);
  }
 
  haveAllPlayersChecked() {
    return (
      this.playerList.getAllPlayersHaveActed() && this.currentMaxWager === 0
    );
  }
 
  haveAllPlayersCalled() {
    return (
      this.playerList.getAllPlayersHaveActed() &&
      this.currentMaxWager > 0 &&
      this.playerList.getCurrentPlayer().getCurrentWager() ===
        this.currentMaxWager
    );
  }

  isStreetActionOver() {
    return (
      this.playerList.getNumPlayers()<1||(this.playerList.getNumPlayers() ===1 
      && this.playersAllInThisStreet.length===0)||(this.haveAllPlayersChecked() 
      ||this.haveAllPlayersCalled())
    );
  }

  isHandActionOver() {
    return this.street == null || this.playerList.getNumPlayers() <= 1;
  }
 
  getAllHoleCards() {
    const allPlayersAtShowdown = this.playerList
      .getAllPlayers()
      .concat(this.playersAllInThisHand);
    const allHoleCards = {};
    for (let i = 0; i < allPlayersAtShowdown.length; i++) {
      const thisPlayerUsername = allPlayersAtShowdown[i].getUsername();
      allHoleCards[thisPlayerUsername] = allPlayersAtShowdown[i].getHoleCards();
    }
    return allHoleCards;
  }


  updateGameState(action) {
    switch (action.type) {
      case "fold": {
        this.foldCurrentPlayer(action.name);
        break;
      }
      case "check": {
        this.handleWagerAndGetNextPlayer(0); 
        break;
      }
      case "call": {
        this.handleWagerAndGetNextPlayer(Math.min(this.playerList.getCurrentPlayer().currentStack,
          this.currentMaxWager -
            this.playerList.getCurrentPlayer().getCurrentWager())
        );
        break;
      }
      case "bet": {
        this.currentLegalMinRaise = action.amount + this.playerList.getCurrentPlayer().getCurrentWager() - this.currentMaxWager;
        console.log(this.currentLegalMinRaise);
        this.currentMaxWager =
          Math.max(this.playerList.getCurrentPlayer().getCurrentWager() + action.amount, this.currentMaxWager);
        this.handleWagerAndGetNextPlayer(action.amount); 
     break;
      }
    }
  }

  foldCurrentPlayer(name) {
    this.playersFoldedThisStreet.push(this.playerList.getCurrentPlayer());
    this.playersFoldedThisHand.push(this.playerList.getCurrentPlayer());
    this.playerList.currentPlayer.holeCards = [];  
    this.activePot += this.playerList.currentPlayer.currentWager;
    this.playerList.currentPlayer.currentWager = 0;
    this.playerList.setNextPlayer(); 
    this.playerList.removePlayer(name);
  }
 
  handleWagerAndGetNextPlayer(amountAdditionalPutIn) {
    let allInUsername = null;
    if (amountAdditionalPutIn > 0) {
      this.playerList
        .getCurrentPlayer()
        .updateWagerAndStack(amountAdditionalPutIn);
      if (this.playerList.getCurrentPlayer().getCurrentStack() <= 0) { 
        this.playersAllInThisStreet.push(this.playerList.getCurrentPlayer());
        allInUsername = this.playerList.getCurrentPlayer().getUsername();
      }
    }
    this.playerList.getCurrentPlayer().setHasActed(true);
    this.playerList.setNextPlayer()
    if (allInUsername !== null) {
      this.playerList.removePlayer(allInUsername);
    }
  }

  updatePotsAndPlayers(potInfo) {
    this.activePot = potInfo.activePot;
    this.sidepots = potInfo.sidepots;
    this.playersAllInThisHand = potInfo.playersAllInThisHand;
  }

  issueBlinds() {
    this.bigBlindPlayer.updateWagerAndStack(this.BIG_BLIND);
    this.smallBlindPlayer.updateWagerAndStack(this.BIG_BLIND / 2);
    this.currentMaxWager = this.BIG_BLIND;   
  }

  clearWagers() {
    this.currentMaxWager = 0;
    this.currentLegalMinRaise = this.BIG_BLIND;
    this.playerList.resetCurrentWagers();
    this.playerList.setAllPlayersHaveActedTo(false);
    this.playersFoldedThisStreet = [];
    this.playersAllInThisStreet = [];
  }

  
  concludeStreet() {
    this.goToNextStreet();
    const allPlayersFromThisStreet = this.playerList.players
      .concat(this.playersAllInThisStreet)
      .concat(this.playersFoldedThisStreet);
    const fullPlayerListFromThisStreet = new PlayerList(
      allPlayersFromThisStreet, allPlayersFromThisStreet[0]
    );

    const wagersThisStreet = fullPlayerListFromThisStreet.getCurrentWagers();
    
    const potInfo = calculatePots(
      this.activePot,
      this.sidepots,
      wagersThisStreet,
      this.playersAllInThisStreet,
      this.playersAllInThisHand
    );
    this.updatePotsAndPlayers(potInfo);
  }

  async concludeHand() {
    if (this.playersAllInThisHand.length > 0) {
      await this.dealRemainingBoardCards();
    }
    if (
      this.playerList.getNumPlayers() === 1 &&
      this.playersAllInThisHand.length === 0
    ) {
      this.playerList.getCurrentPlayer().currentStack += this.activePot;
      
    }    
    else {
      const rankingInfo = rankPlayers(this.boardCards, this.getAllHoleCards());
      const playersRanked = rankingInfo[0];

      const playerListOfAllIns = new PlayerList(this.playersAllInThisHand);
      const winningsOwed = assignAllPots(
        this.activePot,
        this.sidepots,
        playerListOfAllIns.getPlayerIDs(),
        this.playerList.getPlayerIDs(),
        playersRanked,
        this.MIN_CHIP_VALUE
      );
      console.log(winningsOwed);
      for (const id in winningsOwed) {
         let player = this.game
          .returnAllPlayers()
          .find((player) => player.id === id);
        if (player){
            player.currentStack = player.currentStack + Number(winningsOwed[id]);
       }
      }
    }
    console.log(`HAND ${this.HAND_ID} IS NOW OVER! =D\n`);
    this.boardCards = [];

    for (let i = 0; i < this.playersAllInThisHand.length; i++) {
      const player = this.playersAllInThisHand[i];
      if (player.currentStack === 0) {
           this.game.masterList[player.seat] = null;
      }
    }
    this.clearWagers();
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


  async playHand() {
    console.log(`\nStarting hand ${this.HAND_ID}`);
   
    this.dealHoleCards();

   
    while (!this.isHandActionOver()) {
      console.log(`\nStarting street: ${this.street.toUpperCase()}`);
  
      this.clearWagers();
      this.dealStreet();
      if (this.street == Streets.PREFLOP) {
        
        this.issueBlinds();
        this.io.to(this.table).emit("actionRequested", {
          players: this.game.masterList,
          board: this.boardCards,
          maxWager: this.currentMaxWager,
          currentPlayer: this.playerList.currentPlayer.getUsername(),
          minLegalRaise: this.currentLegalMinRaise
        });
      }
      else{
          let i= this.buttonPlayer.seat;
          while(true){
             i = (i+1)>8?0: i+1     
             if (this.game.masterList[i] && this.game.masterList[i].holeCards.length >0 
             && this.game.masterList[i].currentStack !== 0){
                 this.playerList.currentPlayer = this.game.masterList[i];
                 break; 
             }
          }  
          this.io.to(this.table).emit("actionRequested", {
          
            players: this.game.masterList,
            board: this.boardCards,
            maxWager: this.currentMaxWager,
            currentPlayer: this.playerList.currentPlayer.username,
            minLegalRiase: this.currentLegalMinRaise
          });
     }
  
      while (!this.isStreetActionOver()) {
        await this.sleep(1000);
      }

      this.concludeStreet();
    }
    await this.concludeHand();
    return this.smallBlindPlayer; 
  }
}
module.exports = Hand;

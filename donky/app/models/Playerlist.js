/*
 * A PlayerList object to allow for easier manipulation of the list of players
 */

class PlayerList {
  constructor(players, buttonPlayer =null) {
    this.players = players;
    
    this.currentPlayer = buttonPlayer;
    if (!buttonPlayer){
        this.currentPlayer = this.players[0];
    
    }
    if (this.players.length>2 ){
        this.setNextPlayer().setNextPlayer().setNextPlayer() ;
        
    }   
  
    
    this.length = this.players.length;

  }

  resetCurrentPlayer() {
    this.currentPlayer = this.players[0];
  }

  setCurrentPlayer(id) {
    if (id === null) {
      this.currentPlayer = this.players[0];
    } else {
      const index = this.players.findIndex((player) => player.id === id);
      this.currentPlayer = this.players[index];
    }
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getCurrentID() {
    return this.currentPlayer.id;
  }

  removePlayer(username) {
    const index = this.players.findIndex(
      (player) => player.username === username
    );
    this.players.splice(index, 1);
    this.length = this.players.length;
  }

  getPlayerByID(playerID) {
    return this.players.find((player) => player.id === playerID);
  }

  getFirstPlayer() {
    return this.players[0];
  }

  getAllPlayers() {
    return this.players;
  }

  getPlayerIDs() {
    return this.players.map((player) => player.id);
  }

  getNumPlayers() {
    return this.players.length;
  }

  setAllPlayersHaveActedTo(value) {
    this.players.forEach((player) => player.setHasActed(value));
  }

  getAllPlayersHaveActed() {
    const numPlayersWhoHaveActed = this.players
      .map((player) => player.getHasActed())
      .filter(Boolean).length;
    return numPlayersWhoHaveActed === this.players.length;
  }

  getCurrentWagers() {
    const result = {};
    for (let i = 0; i < this.players.length; i++) {
      result[this.players[i].getID()] = this.players[i].getCurrentWager();
    }
    return result;
  }

  getPlayerCurrentWager(playerID) {
    return this.getPlayerByID(playerID).getCurrentWager();
  }

  resetCurrentWagers() {
    this.players.forEach((player) => player.resetCurrentWager());
  }

  setPreviousPlayer() {
    const currentID = this.currentPlayer.id;
    let currentIndex = this.players.findIndex(
      (player) => player.id === currentID
    );

    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = this.players.length - 1;
    }
    this.currentPlayer = this.players[currentIndex];
    return this;
  }

  setNextPlayer() {
    const currentID = this.currentPlayer.id;
    const numPlayers = this.players.length;

    let nextPlayer = null;
    if (this.players.length > 1) {
      const index = this.players.findIndex((player) => player.id === currentID);
      // Check if current player is at the end of the array
      if (index === numPlayers - 1) {
        nextPlayer = this.players[0];
      } else {
        nextPlayer = this.players[index + 1];
      }
      this.currentPlayer = nextPlayer;
    }
    return this;
  }

  getNextPlayer() {
    const currentID = this.currentPlayer.id;
    let currentIndex = this.players.findIndex(
      (player) => player.id === currentID
    );

    currentIndex += 1;
    if (currentIndex > this.players.length - 1) {
      currentIndex = 0;
    }
    
    return this.players[currentIndex];
  }

  getPreviousPlayer() {
    const currentID = this.currentPlayer.id;
    let currentIndex = this.players.findIndex(
      (player) => player.id === currentID
    );

    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = this.players.length - 1;
    }

    return this.players[currentIndex];
  }
}

module.exports = PlayerList;

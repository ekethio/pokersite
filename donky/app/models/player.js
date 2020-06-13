/*
 * A Player object to store all info about a specific player.
 */

class Player {
  constructor(
    username,
    id,
    totalBuyIn,
    seat,
    holeCards = null,
    isActive = false,
    isAllIn = false,
    lastAction = null
  ) {
    this.username = username;
    this.id = id;
    this.seat = seat;
    this.totalBuyIn = totalBuyIn;
    this.currentStack = totalBuyIn;

    // Hand
    this.holeCards = [];
    this.isActive = isActive;
    this.isAllIn = isAllIn;
    this.lastAction = lastAction;
    this.currentWager = 0;
    this.hasActed = false;
  }

  // A whole bunch of getters and setters: Please use them! Don't directly access player variables.

  // TODO: Remove any functions below that are never used

  updateWagerAndStack(amount) {
    if (amount >= this.currentStack) {
      // Player has gone all in
      this.currentWager += this.currentStack;
      this.currentStack = 0;
      this.setIsAllIn(true);
    } else {
      // Player will still have more chips behind
      this.currentWager += amount;
      this.currentStack -= amount;
    }
  }

  setHasActed(hasActed) {
    this.hasActed = hasActed;
  }

  getHasActed() {
    return this.hasActed;
  }

  setCurrentWager(wager) {
    this.currentWager = wager;
  }

  getCurrentWager() {
    return this.currentWager;
  }

  setUsername(username) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }

  addMoney(amountToAdd) {
    this.totalBuyIn += amountToAdd;
    this.currentStack += amountToAdd;
  }

  getID() {
    return this.id;
  }

  updateBuyIn(amountToAdd) {
    this.totalBuyIn += amountToAdd;
  }

  getBuyIn() {
    return this.totalBuyIn;
  }

  updateCurrentStack(amountToAdd) {
    // To lower a stack just pass a negative numbers as amountToAdd
    this.currentStack += amountToAdd;
  }

  getCurrentStack() {
    return this.currentStack;
  }

  updateCurrentStreetBet(amountToAdd) {
    this.currentStreetBet += amountToAdd;
  }

  getCurrentStreetBet() {
    return this.currentStreetBet;
  }

  setHoleCards(cards) {
    this.holeCards = cards;
  }

  getHoleCards() {
    return this.holeCards;
  }

  setIsActive(isActive) {
    // boolean
    this.isActive = isActive;
  }

  getIsActive() {
    return this.isActive;
  }

  setIsBigBlind(isBigBlind) {
    // boolean
    this.isBigBlind = isBigBlind;
  }

  getIsAllIn() {
    return this.isAllIn;
  }

  setIsAllIn(isAllIn) {
    // boolean;
    this.isAllIn = isAllIn;
  }

  resetCurrentWager() {
    this.currentWager = 0;
  }

  getCurrentProfit() {
    return this.currentStack - this.totalBuyIn;
  }

  setLastAction(action) {
    this.lastAction = action;
  }

  getLastAction() {
    return this.lastAction;
  }

  toString() {
    return `NAME=${this.username}; ID=${this.id}; BUYIN=${this.totalBuyIn}; SEAT=${this.seatNum}`; // TODO: seatNum is not an instance variable!
  }
}

// Export this class
module.exports = Player;

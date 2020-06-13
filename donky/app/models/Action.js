class Action {
  constructor(type, amount, playerID) {
    this.playerID = playerID;
    this.type = type;
    this.amount = amount;
  }
}

module.exports = Action;

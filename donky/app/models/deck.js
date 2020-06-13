class Deck {
  constructor() {
    this.deck = [];
    this.VALID_RANKS = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "T",
      "J",
      "Q",
      "K",
      "A",
    ];
    this.VALID_SUITS = ["s", "h", "c", "d"];

    // Construct a deck by making one of each card using the ranks and suits given above
    for (let i = 0; i < this.VALID_SUITS.length; i++) {
      for (let j = 0; j < this.VALID_RANKS.length; j++) {
        this.deck.push(this.VALID_RANKS[j] + this.VALID_SUITS[i]);
      }
    }
  }

  // Deal a random card from the deck. Remove it from the deck and return it.
  dealCard() {
    const card = this.deck.splice(
      Math.floor(Math.random() * this.deck.length),
      1
    )[0]; // Select and remove random card
    return card;
  }

  // Check what cards remain in the deck
  getRemainingCards() {
    return this.deck;
  }

  // Check how many cards are left in the deck
  getDeckLength() {
    return this.deck.length;
  }
}

// Export this class
module.exports = Deck;

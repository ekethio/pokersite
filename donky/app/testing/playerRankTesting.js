const randomID = require("../utils/randomID.js");
const { rankPlayers } = require("../utils/handEval.js");
const Game = require("../models/game.js");
const Player = require("../models/player.js");
const Deck = require("../models/deck.js");

/*
 * Generate an array of random playerIDs.
 * @param numIDs is an integer determining how many playerIDs should be generated.
 * returns playerIDs: an array containing the specified number of playerIDs.
 */
function generateIDs(numIDs) {
  const playerIDs = [];

  for (let i = 0; i < numIDs; i++) {
    playerIDs.push(randomID.randomID());
  }

  return playerIDs;
}

/*
 * Give cards to each player
 * @param playerIDs is an array of strings for each player's ID.
 * returns an array containing two items:
 *  playerCards: a dictionary relating each playerID to an array of two cards (strings)
 *  boardCards: an array of five cards (strings)
 */
function dealAFullHand(playerIDs, currentDeck) {
  // Give each player 2 cards
  const allPlayersCards = {};
  for (let i = 0; i < playerIDs.length; i++) {
    const currentPlayersCards = [];
    for (let j = 0; j < 2; j++) {
      // 2 hole cards per player
      currentPlayersCards[j] = currentDeck.dealCard();
    }
    allPlayersCards[playerIDs[i]] = currentPlayersCards;
  }
  // Give the board 5 cards
  const boardCards = [];
  for (let i = 0; i < 5; i++) {
    // 5 board cards total
    boardCards[i] = currentDeck.dealCard();
  }

  return [allPlayersCards, boardCards];
}

const boardCards = ["Ts", "Js", "Qs", "2s", "6c"];
const playersAndTheirCards = {};
playersAndTheirCards.gunk = ["5d", "7d"];
playersAndTheirCards.fish = ["As, Kh"];
playersAndTheirCards.poop = ["Kd", "9c"];
playersAndTheirCards.bert = ["2c", "6h"];

rankPlayers(boardCards, playersAndTheirCards);

/* *************************** TESTING BELOW HERE ************************** */
/*
const numPlayers = Math.floor(Math.random() * 3) + 4; // for this test, create 4 to 6 total players
const players = generateIDs(numPlayers);

const currentDeck = new Deck();

const handInfo = dealAFullHand(players, currentDeck);
const playersCards = handInfo[0];
const boardCards = handInfo[1];

console.log('\n~~~ The players and their cards: ~~~');
console.log(playersCards);
console.log('\n >>>>>>>>>> THE BOARD: ' + boardCards + '<<<<<<<<<<');

const handsEvaluated = handEval.rankPlayers(boardCards, playersCards);
const playersBestToWorst = handsEvaluated[0];
const playersHandInfo = handsEvaluated[1];

console.log('\n ~~~ The players, ranked from best to worst: ~~~');
for (let i = 0; i < numPlayers; i++) {
  const playerID = playersBestToWorst[i];
  const playerHand = playersHandInfo[playersBestToWorst[i]];
  console.log('Player ' + playerID.slice(3, 11) + ' has ' + playersCards[playerID] + '; best 5 are ' + playerHand.cards + ' which is ' + playerHand.type);
}
console.log('\nPlayer ' + playersBestToWorst[0] + ' wins the hand!\n\n');
*/

/* *************************** TEST NEW GAME ************************** */
/*
console.log('initializing new game');

const testGame = new Game();

// turn on verbose which will print a bunch of shit during testing and after functions are called
testGame.toggleVerbose();

const player1 = new Player('donky', 68572, 100);
const player2 = new Player('horse boi', 13242, 110);
const player3 = new Player('durrrr', 52, 490);
const player4 = new Player('rankle spankle', 420, 666);

testGame.addPlayer(player1);
testGame.addPlayer(player2);
testGame.addPlayer(player3, 7);
// Should seat at seat 2 since 0 is occupied
testGame.addPlayer(player4, 0);

// Turn the dictionary of players into a linked list and create a Hand object
testGame.startNewHand();
testGame.endHand();
*/

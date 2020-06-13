/**
 * These functions are designed to evaluate Texas Hold'em poker hands. They will only be called at the END of a hand.
 * The core data structure is the `hand` object, which contains all parameters to evaluate and compare hands.
 * The core usage of this set of functions is to take the information about the cards on the table and return an ordered list of players' hands from best to worst.
 *
 * Whenever a function parameter requires an array of "two-char card strings", those specifically are as follows:
 *  The first character of each two-char card string must be a card rank, from the set (2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A).
 *  The second character of each two-char card string must be a card suit, from the set (s, h, c, d).
 *  Note that all ranks are capitalized, and all suits are lowercase. So, here's what a valid card looks like: 'Th', '3d', 'Qc', '2d', '9s'
 *
 */

/**
 * Summary. Given an array of exactly five (5) cards as 2-char strings, create a new object for that hand
 * @param fiveCards is an array of five valid two-char card strings, e.g. ['Th','Qc','3d','2d','9s']
 * @returns hand: the hand as an object with a delineated .cards property
 */
function createFiveCardHandObject(fiveCards) {
  const ranks = [
    fiveCards[0][0],
    fiveCards[1][0],
    fiveCards[2][0],
    fiveCards[3][0],
    fiveCards[4][0],
  ];
  const ranksSorted = cardRanksToInts(ranks).sort((a, b) => b - a);
  return {
    // create and return a new hand object
    value: 0, // the hand's value where straight flush = 9, quads = 8, boat = 7, ..., pair = 2, high card = 1. (0 means not yet evaluated)
    type: "", // the type of hand (e.g. straight, flush, pair, etc.)
    cards: fiveCards, // the five cards making up the hand, each as a two-char string (e.g. '3d', '8s', 'Jc', 'Ah', etc.)
    ranks: ranksSorted, // the five card ranks, as ints, sorted in descending order (e.g. [13, 12, 6, 5, 2] for KQ652)
    comparisonInfo: [], // the relevant ordered card rank ints to compare two hands of the same value. Ex: for two pair we need high pair + low pair + kicker
  };
}

/**
 * Summary. Given an array of card ranks, replace all face card letters with their corresponding values.
 * @param ranks is an array of single-character strings, each representing a card's rank, from the set (2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A)
 * @returns ranksAsInts: an array of ints (from 2 to 14) representing the cards' ranks, in the same order as the original array of ranks
 */
function cardRanksToInts(ranks) {
  const ranksAsInts = [];
  const FACE_CARDS = { T: 10, J: 11, Q: 12, K: 13, A: 14 }; // Note A = 14 means we need special logic (using %8) when A is acting as a low card in a straight
  for (let i = 0; i < ranks.length; i++) {
    ranksAsInts[i] = parseInt(ranks[i]);
    if (!ranksAsInts[i]) {
      ranksAsInts[i] = FACE_CARDS[ranks[i]];
    }
  }
  return ranksAsInts;
}

/**
 * Summary. Given a `hand` object, determine the rank of the hand and store it as a property in the object
 * @param hand is the hand as an object with a .cards property
 * @returns hand: the hand as an object with all value/sorting properties delineated
 */
function analyzeFiveCardHand(hand) {
  // Set a Boolean flag for whether all 5 cards make a flush
  const suits = [
    hand.cards[0][1],
    hand.cards[1][1],
    hand.cards[2][1],
    hand.cards[3][1],
    hand.cards[4][1],
  ];
  const flush =
    suits[0] === suits[1] &&
    suits[1] === suits[2] &&
    suits[2] === suits[3] &&
    suits[3] === suits[4];
  // Set a Boolean flag for whether all 5 cards make a straight
  const lowCard = hand.ranks[4];
  const straight =
    lowCard + 1 === hand.ranks[3] &&
    lowCard + 2 === hand.ranks[2] &&
    lowCard + 3 === hand.ranks[1] &&
    (lowCard + 4) % 8 === hand.ranks[0] % 8; // %8 makes 23456 and 2345A both work

  // Set array of Boolean flags for where the pairs of matching cards are, if any (e.g. [true, true, true, false] for quads with lower kicker)
  const matchLocs = [
    hand.ranks[0] === hand.ranks[1],
    hand.ranks[1] === hand.ranks[2],
    hand.ranks[2] === hand.ranks[3],
    hand.ranks[3] === hand.ranks[4],
  ];
  // Set flag for how many total pairs of matching cards there are (note that trips counts as 2 pairs of matching cards, and quads counts as 3 pairs of matching cards)
  let numMatchingCardPairs = 0;
  for (let i = 0; i < matchLocs.length; i++) {
    if (matchLocs[i]) {
      numMatchingCardPairs += 1;
    }
  }

  // Run through the possible hand types from best to worst, checking each one's criteria
  if (flush && straight) {
    // straight flush (to compare, only need highest card)
    hand.value = 9;
    hand.comparisonInfo = [hand.ranks[0]];
  } else if (numMatchingCardPairs === 3) {
    // quads or full house
    if (!matchLocs[0]) {
      // quads; kicker lower (to compare, need quad card & kicker)
      hand.value = 8;
      hand.comparisonInfo = [hand.ranks[1], hand.ranks[0]];
    } else if (!matchLocs[3]) {
      // quads; kicker higher (to compare, need quad card & kicker)
      hand.value = 8;
      hand.comparisonInfo = [hand.ranks[0], hand.ranks[4]];
    } else {
      // full house (to compare, need set card & pair card)
      hand.value = 7;
      if (matchLocs[1]) {
        // higher set; lower pair
        hand.comparisonInfo = [hand.ranks[0], hand.ranks[4]];
      } else {
        // lower set; higher pair
        hand.comparisonInfo = [hand.ranks[4], hand.ranks[0]];
      }
    }
  } else if (flush) {
    // flush (to compare, need all five cards in descending order)
    hand.value = 6;
    hand.comparisonInfo = hand.ranks;
  } else if (straight) {
    // straight (to compare, only need highest card)
    hand.value = 5;
    hand.comparisonInfo = [hand.ranks[0]];
  } else if (numMatchingCardPairs === 2) {
    // trips or two pairs
    if (matchLocs[0] && matchLocs[1]) {
      // trips; both kickers lower (to compare, need trip card & high kicker & low kicker)
      hand.value = 4;
      hand.comparisonInfo = [hand.ranks[0], hand.ranks[3], hand.ranks[4]]; // trip card, kicker, kicker
    } else if (matchLocs[1] && matchLocs[2]) {
      // trips; one kicker higher & one lower (to compare, need  trip card & high kicker & low kicker)
      hand.value = 4;
      hand.comparisonInfo = [hand.ranks[1], hand.ranks[0], hand.ranks[4]];
    } else if (matchLocs[2] && matchLocs[3]) {
      // trips; both kickers higher (to compare, need trip card & high kicker & low kicker)
      hand.value = 4;
      hand.comparisonInfo = [hand.ranks[4], hand.ranks[0], hand.ranks[1]];
    } else {
      hand.value = 3; // two pairs (to compare, need higher pair & lower pair & kicker)
      if (!matchLocs[0]) {
        // kicker higher than both pairs
        hand.comparisonInfo = [hand.ranks[2], hand.ranks[4], hand.ranks[0]];
      } else if (!matchLocs[3]) {
        // kicker lower than both pairs
        hand.comparisonInfo = [hand.ranks[0], hand.ranks[2], hand.ranks[4]];
      } else {
        // kicker in between the two pairs
        hand.comparisonInfo = [hand.ranks[0], hand.ranks[4], hand.ranks[2]];
      }
    }
  } else if (numMatchingCardPairs === 1) {
    // pair (to compare, need pair card & high kicker & mid kicker & low kicker)
    hand.value = 2;
    if (matchLocs[0]) {
      // pair higher than all kickers
      hand.comparisonInfo = [
        hand.ranks[0],
        hand.ranks[2],
        hand.ranks[3],
        hand.ranks[4],
      ];
    } else if (matchLocs[1]) {
      // one kicker is higher than the pair
      hand.comparisonInfo = [
        hand.ranks[1],
        hand.ranks[0],
        hand.ranks[3],
        hand.ranks[4],
      ];
    } else if (matchLocs[2]) {
      // two kickers are higher than the pair
      hand.comparisonInfo = [
        hand.ranks[2],
        hand.ranks[0],
        hand.ranks[1],
        hand.ranks[4],
      ];
    } else {
      // pair is lower than all three kickers
      hand.comparisonInfo = [
        hand.ranks[3],
        hand.ranks[0],
        hand.ranks[1],
        hand.ranks[2],
      ];
    }
  } else {
    // high card only; no pairs (to compare, need all five cards in descending order)
    hand.value = 1;
    hand.comparisonInfo = hand.ranks;
  }

  const ALL_HAND_TYPES = [
    "Straight Flush",
    "Quads",
    "Full House",
    "Flush",
    "Straight",
    "Trips",
    "Two Pairs",
    "Pair",
    "High Card",
  ];
  hand.type = ALL_HAND_TYPES[ALL_HAND_TYPES.length - hand.value];
  return hand;
}

/**
 * Summary. Given two `hand` objects, evaluate which is better
 * @param firstHand is the first hand as an object with value/sorting properties; (return true iff this hand is better)
 * @param secondHand is the second hand as an object with value/sorting properties (return false iff this hand is better)
 * @returns a makeshift ternary: 1 if firstHand is strictly better, 0 if the two hands are equivalent, and -1 if firstHand is strictly worse
 */
function firstHandIsBetter(firstHand, secondHand) {
  // If one hand has a higher value than the other, that hand is better (e.g. straight vs. flush or pair vs. quads)
  if (firstHand.value > secondHand.value) {
    return 1;
  } else if (firstHand.value < secondHand.value) {
    return -1;
  } else {
    // If one hand has a better comparison card at any point, that hand is better
    for (let i = 0; i < firstHand.comparisonInfo.length; i++) {
      if (firstHand.comparisonInfo[i] > secondHand.comparisonInfo[i]) {
        return 1;
      } else if (firstHand.comparisonInfo[i] < secondHand.comparisonInfo[i]) {
        return -1;
      }
    }
  }
  // If the two hands are identical, they are equal
  return 0;
}

/**
 * Summary. Given an array of 7 cards, check each combination of 5 cards in order to identify and return the best one
 * @param sevenCards is an array of exactly 7 valid two-char card strings, e.g. ['Th','Qc','3d','2d','Qs','Ks','Kh']
 * @returns bestHand: a `hand` object representing the best five-card hand that can be made
 */
function findBestFiveCardHand(sevenCards) {
  let bestHand = null;
  for (let i = 0; i < sevenCards.length; i++) {
    for (let j = i + 1; j < sevenCards.length; j++) {
      const fiveCards = [];
      for (let k = 0; k < sevenCards.length; k++) {
        if (k !== i && k !== j) {
          fiveCards.push(sevenCards[k]);
        }
      }
      const newHand = analyzeFiveCardHand(createFiveCardHandObject(fiveCards));
      if (!bestHand || firstHandIsBetter(newHand, bestHand) > -1) {
        bestHand = newHand;
      }
    }
  }
  return bestHand;
}

/**
 * Summary. Given an array of 7 cards, check each combination of 5 cards; identify and return the best one
 * @param boardCards is an array of exactly 5 valid two-char card strings, e.g. ['Th','Qc','3d','2d','Qs']
 * @param holeCards is an variable-length array OF arrays, each containing exactly 2 two-char card strings. Ex: [['Th','Qc'], ['3d','2d'], ['Qs','Ks']]
 * @returns bestHands: an array of objects representing the players' best hands, in the same order as the original array of holeCards
 */
function getEachPlayersBestHand(boardCards, holeCards) {
  const bestHands = [];
  for (let i = 0; i < holeCards.length; i++) {
    bestHands[i] = findBestFiveCardHand(boardCards.concat(holeCards[i]));
  }
  return bestHands;
}

/*
 * Summary. Given an array of at least one player's hand, return an array containing the indices of each player, from strongest to weakest hand
 * @param boardCards is an array of exactly 5 valid two-char card strings, e.g. ['Th','Qc','3d','2d','Qs']
 * @param playerIDsAndHoleCards is a dictionary with a player's ID as the key and that player's hole cards as the value
 *  A player's hole cards are represented as an array of exactly 2 valid two-char card strings, e.g. ['As','Kc']
 *  Note that the only players in this array should be those still eligible for any pot at showdown! No player who folded should be in this array.
 * @returns rankingAndDict: an array of two items: an array OF SUBARRAYS of playerIDs (where the subarrays are ranked from best hand to worst hand), and a dictionary with keys = playerIDs and values = `hand` objects
 *  Note that the ranked playerIDs array will be composed of sub-arrays. A player in a sub-array of length > 1 is chopping with the other players in that sub-array.
 */
function rankPlayers(boardCards, playerIDsAndHoleCards) {
  const playerIDs = Object.keys(playerIDsAndHoleCards);
  const allHoleCards = Object.values(playerIDsAndHoleCards);
  const bestHandForEachPlayer = getEachPlayersBestHand(
    boardCards,
    allHoleCards
  );

  const bestHandsByPlayerID = {};
  for (let g = 0; g < bestHandForEachPlayer.length; g++) {
    bestHandsByPlayerID[playerIDs[g]] = bestHandForEachPlayer[g];
  }

  // For each player in the unsorted list of hands, iterate through and compare to each hand in the list of ranked hands.
  const playersRanked = []; // Note: that this will be an array OF ARRAYS, with players in the same sub-array having equivalent hands
  for (let i = 0; i < bestHandForEachPlayer.length; i++) {
    let playerInserted = false;
    for (let j = 0; j < playersRanked.length; j++) {
      const isFirstHandBetter = firstHandIsBetter(
        bestHandsByPlayerID[playerIDs[i]],
        bestHandsByPlayerID[playersRanked[j][0]]
      ); // Compare with first hand in sub-array
      // As soon as the new hand is not strictly worse than a particular hand in the list of ranked hands, put the new hand with or before that hand in the ranked list.
      if (isFirstHandBetter > -1) {
        if (isFirstHandBetter === 1) {
          // New hand is better, so put it before the previous hand
          playersRanked.splice(j, 0, [playerIDs[i]]);
        } else if (isFirstHandBetter === 0) {
          // New hand is equal/tied (chopping), so put it in the same sub-array as the previous hand
          playersRanked[j].push(playerIDs[i]);
        }
        playerInserted = true;
        break;
      }
    }
    // If new hand wasn't better than any of the hands already in the list of ranked hands, put it at the end of that list.
    if (!playerInserted) {
      playersRanked.push([playerIDs[i]]);
    }
  }

  const rankingAndDict = [playersRanked, bestHandsByPlayerID];
  return rankingAndDict;
}

// Export the helpful function(s)
exports.rankPlayers = rankPlayers;

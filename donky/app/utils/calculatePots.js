/**
 * Summary. At the end of any given (and every single) STREET of betting, calculate all sidepots created during that street.
 * @param activePot is the total amount already in the active pot (not counting any already-dealt-with sidepots) before this betting street began
 * @param sidepots is an ORDERED array of all sidepots already created and set aside for players who have gone all-in
 * @param currentStreetWagers is a dictionary tying playerIDs to the total amount they put in on the current street of betting
 * @param allInsThisStreet is an array listing every player who went all-in on the CURRENT street of betting
 * @param allInsThisHand is an ORDERED array listing every playerID who went all-in at any point this hand. Note: this array MUST list players in the order in which they went all-in! Note: this array MUST list players in increasing order of their hand-start stack sizes!
 * returns a dictionary tying the new updated values for the above variables to what they are after all calculations
 *  ^ TODO: the final element in that dict, playersStillNotAllIn, is probably not going to be used at all & can be removed from the return if unnecessary
 *
 * Note that activePot is the current pot that all players who are not already all-in are contributing to.
 *  When a player goes all-in, a sidepot is created for them and added to the sidepots array.
 *  At the end of the hand, if nobody has gone all in, there will only be an activePot (sidepots will be empty).
 * Also note that sidepots SHOULD end up having a sidepot of $0 if two players went all-in for the same stack size (or two such sidepots if 3 did, etc.)
 */
function calculatePots(
  activePot,
  sidepots,
  currentStreetWagers,
  allInsThisStreet,
  allInsThisHand
) {
  const playersWhoWagered = Object.keys(currentStreetWagers); // All players who played this hand

  // If there are all-ins to deal with from this street, process them and make a sidepot for each
  while (allInsThisStreet.length > 0) {
    let smallestAllIn = Infinity;
    let smallestAllInPlayer = "";
    // Out of the players who went all-in this street, find the one who did so with the smallest stack
    for (let i = 0; i < allInsThisStreet.length; i++) {
      if (currentStreetWagers[allInsThisStreet[i].getID()] < smallestAllIn) {
        smallestAllIn = currentStreetWagers[allInsThisStreet[i].getID()];
        smallestAllInPlayer = allInsThisStreet[i];
      }
    }

    // From each player's wagers on this street, add the appropriate amount to the active pot (which may include wagers from previous streets)
    for (let i = 0; i < playersWhoWagered.length; i++) {
      // Identify the total wagered by this particular player on this street
      const amountWagered = currentStreetWagers[playersWhoWagered[i]];
      // If this player put in MORE than (or exactly the amount of) the all-in, add the amount of the all-in to the activePot
      if (amountWagered >= smallestAllIn) {
        activePot += smallestAllIn;
        // Subtract the amount already put into activePot from the total wager this player put in this street
        currentStreetWagers[playersWhoWagered[i]] =
          amountWagered - smallestAllIn;
      } else {
        // If this player put in LESS than the all-in (aka they put in money before folding), put all their dead money into the activePot
        activePot += amountWagered;
        currentStreetWagers[playersWhoWagered[i]] = 0;
      }
    }
    // The activePot is now a sidepot representing everything the all-in player can win (along with any earlier sidepots created)
    allInsThisHand.push(smallestAllInPlayer); // Add the player whose all-in was just processed to the hand's master list of ORDERED all-ins
    allInsThisStreet.splice(allInsThisStreet.indexOf(smallestAllInPlayer), 1); // Remove that player from the street-specific list of all-ins
    sidepots.push(activePot); // Add the new sidepot that was created to the sidepots array
    activePot = 0; // Reset activePot to zero to represent the new pot
  }

  // Once there are no all-ins to process, simply add all new wagers to activePot (NOTE: most streets will skip straight to here)
  const playersStillNotAllIn = [];
  for (let i = 0; i < playersWhoWagered.length; i++) {
    activePot += currentStreetWagers[playersWhoWagered[i]];
    if (currentStreetWagers[playersWhoWagered[i]] > 0) {
      playersStillNotAllIn.push(playersWhoWagered[i]);
    }
  }

  return {
    activePot: activePot,
    sidepots: sidepots,
    playersAllInThisHand: allInsThisHand,
    playersStillNotAllIn: playersStillNotAllIn,
  };
}

// Export the helpful function(s)
exports.calculatePots = calculatePots;

/* END OF FILE */

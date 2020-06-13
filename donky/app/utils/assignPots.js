/**
 * Summary. At the end of the entire HAND, assign pots to the players who deserve them.
 *  Note that the # of sidepots MUST MATCH the # of all-ins; Each sidepot corresponds to a SINGLE all-in. If 2 players are all-in for the same stack, there must be an extra sidepot of 0.
 * @param activePot is the total amount still in the active pot at the end of the hand. Players who went all-in at any point are not eligible for this.
 * @param sidepotsOrdered is an ORDERED array of all sidepots created and set aside for players who went all-in at any point during the hand (will be empty if nobody went all-in).
 * @param allInsOrdered is an ORDERED array listing every player who went all-in at any point this hand (will be empty if nobody went all-in).
 * @param playersStillInHand is an array listing every player still in the hand at showdown, NOT INCLUDING the players who went all in (no overlap between this parameter and allInsThisHand).
 * @param playersRanked is an ORDERED array *of subarrays*, where earlier subarrays are composed of playerIDs with hands better than those in later subarrays. (NOTE: make sure there are no strings in the top-level array; only arrays OF strings!)
 * @param minChipValue is the numerical value of the smallest chip in play, in case of chop pots (integer value)
 * returns winningsByPlayerID, a dictionary where key = playerID and value = the amount they are owed (of all pots/sidepots combined)
 */
function assignAllPots(
  activePot,
  sidepotsOrdered,
  allInsOrdered,
  playersStillInHand,
  playersRanked,
  minChipValue
) {
  const showdownPlayers = playersStillInHand.concat(allInsOrdered); // Everybody, all-in or not, eligible for any pot at showdown (i.e. they never folded)
  let winningsByPlayerID = {}; // Create a dictionary tying palyerIDs to the amounts they are owed from this hand
  for (let i = 0; i < showdownPlayers.length; i++) {
    winningsByPlayerID[showdownPlayers[i]] = 0;
  }

  // For each sidepot, in order it was created, assign it to the eligible player(s) with the best hand
  while (sidepotsOrdered.length > 0) {
    const currentPot = sidepotsOrdered.shift(); // Remove first pot from array of pots
    const playersWithBestHand = playersRanked[0]; // First subarray in playersRanked contains the player(s) who deserve this pot
    winningsByPlayerID = awardSinglePot(
      winningsByPlayerID,
      currentPot,
      playersWithBestHand,
      minChipValue
    );

    // Remove the player corresponding to the sidepot that was just awarded from both the allInsOrdered array AND the overall playersRanked array
    const newlyIneligiblePlayer = allInsOrdered.shift();
    playersRanked = removeFromNestedArray(newlyIneligiblePlayer, playersRanked);
  }

  // Assign the remaining activePot to the still-eligible player(s) with the best hand
  winningsByPlayerID = awardSinglePot(
    winningsByPlayerID,
    activePot,
    playersRanked[0],
    minChipValue
  );

  return winningsByPlayerID;
}

/**
 * Summary. Award a single pot to the deserving player(s), chopping as appropriate in case of a tie.
 * @param winningsByPlayerID is a dictionary where key = playerID and value = the amount they are owed in total
 * @param currentPot is the numerical value of the current pot to award
 * @param playersWithBestHand is an array containing the ID(s) of the player(s) with the best hand, to whom this pot must be awarded/divided
 * @param minChipValue is the numerical value of the smallest chip in play, in case of chop pots (should be 1 most likely)
 * returns winningsByPlayerID, the same dictionary it was given but updated to include the pot that was awarded
 */
function awardSinglePot(
  winningsByPlayerID,
  currentPot,
  playersWithBestHand,
  minChipValue
) {
  const numChoppers = playersWithBestHand.length; // The number of players who are winning or chopping this pot

  if (numChoppers === 1) {
    // If there's only one player who deserves this pot, give it to them
    winningsByPlayerID[playersWithBestHand[0]] += currentPot;
  } else {
    // If there's more than one player who deserves this pot, split it evenly among them
    const winningsPerChopper = Math.floor(currentPot / numChoppers); // Round down (we'll deal with the leftover momentarily)

    let totalAwardedSoFar = 0; // Track total amount awarded so far so that we can deal with any leftover cents later
    for (let j = 0; j < playersWithBestHand.length; j++) {
      winningsByPlayerID[playersWithBestHand[j]] += winningsPerChopper;
      totalAwardedSoFar += winningsPerChopper;
    }

    // If the pot couldn't be evenly divided and there are extra chips left over, assign them one-by-one to the players until the whole pot has been awarded
    let i = 0;
    while (totalAwardedSoFar < currentPot) {
      winningsByPlayerID[playersWithBestHand[i]] += minChipValue; // Award one extra minimum chip
      totalAwardedSoFar += minChipValue;
      i += 1; // TODO (minimum priority): make this work in action-order (i.e. give 1st extra chip to 1st player after button & proceed from there)
    }
  }

  return winningsByPlayerID;
}

/**
 * Summary. Remove an element from a singly-nested array (i.e. an array of subarrays where the subarrays are composed of the type of element that is to be removed)
 * @param elementToRemove is the element that is to be found and removed from the singly-nested array (should be a string, int, etc.)
 * @param nestedArray is the singly-nested array (an array composed of subarrays)
 *
 */
function removeFromNestedArray(elementToRemove, nestedArray) {
  for (let i = 0; i < nestedArray.length; i++) {
    const subarray = nestedArray[i];
    if (subarray.includes(elementToRemove)) {
      if (subarray.length > 1) {
        // If there are elements in the subarray aside from the one to be removed, remove the one and replace the rest
        subarray.splice(subarray.indexOf(elementToRemove), 1);
        nestedArray[i] = subarray;
      } else {
        // If the subarray contains only the one element that is to be removed, remove the entire subarray from the main nestedArray
        nestedArray.splice(i, 1);
      }
    }
  }
  return nestedArray;
}

// Export the helpful function(s)
exports.assignAllPots = assignAllPots;

/**
 * Function to create a random alphanumeric ID prepended by "ID-"
 */

// Function to create a random alphanumeric string out of lowercase letters and the digits 0 to 9
function randomID() {
  return (
    "ID-" +
    Math.random().toString(36).substring(2, 10) +
    "-" +
    Math.random().toString(36).substring(2, 10)
  );
}

// Export the helpful function(s) from this class
exports.randomID = randomID;

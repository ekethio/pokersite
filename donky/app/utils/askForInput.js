/**
 * Get user input from Terminal.
 * NOTE: This is only needed until we have a functioning client.
 */

const readline = require("readline");

function askForInput(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// Export the helpful function(s)
exports.askForInput = askForInput;

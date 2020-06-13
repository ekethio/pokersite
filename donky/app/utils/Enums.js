/**
 * Common enums that we will use to represent variables that can take only a few discrete options
 */

const Actions = Object.freeze({ FOLD: "f", CHECK: "x", CALL: "c", BET: "b" });

const Streets = Object.freeze({
  PREFLOP: "Pre-flop",
  FLOP: "Flop",
  TURN: "Turn",
  RIVER: "River",
});

const GameStatus = Object.freeze({
  IN_PROGRESS: "in_progress",
  NOT_STARTED: "not_started",
});

module.exports = { Actions, Streets, GameStatus };

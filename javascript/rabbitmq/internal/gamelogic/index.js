const gamedata = require("./gamedata");
const gamelogic = require("./gamelogic");
const GameState = require("./gameState");
const logs = require("./logs");

module.exports = {
  ...gamedata,
  ...gamelogic,
  ...logs,
  GameState,
};

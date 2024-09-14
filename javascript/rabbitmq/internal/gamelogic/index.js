const gamedata = require("./gamedata");
const gamelogic = require("./gamelogic");
const gameState = require("./gamestate");
const logs = require("./logs");

module.exports = {
  ...gamedata,
  ...gamelogic,
  ...logs,
  ...gameState,
};

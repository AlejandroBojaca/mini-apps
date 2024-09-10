const gamedata = require("./gamedata");
const gamelogic = require("./gamelogic");
const gameState = require("./gamestate");
const logs = require("./logs");
const move = require("./move");
const pause = require("./pause");
const spawn = require("./spawn");
const war = require("./war");

module.exports = {
  ...gamedata,
  ...gamelogic,
  ...gameState,
  ...logs,
  ...move,
  ...pause,
  ...spawn,
  ...war,
};

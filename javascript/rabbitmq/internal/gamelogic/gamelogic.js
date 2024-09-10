const readline = require("node:readline");
const { randomInt } = require("crypto");
const prompt = require("prompt-sync")({ sigint: true });

function printClientHelp() {
  console.log("Possible commands:");
  console.log("* move <location> <unitID> <unitID> <unitID>...");
  console.log("    example:");
  console.log("    move asia 1");
  console.log("* spawn <location> <rank>");
  console.log("    example:");
  console.log("    spawn europe infantry");
  console.log("* status");
  console.log("* spam <n>");
  console.log("    example:");
  console.log("    spam 5");
  console.log("* quit");
  console.log("* help");
}

function clientWelcome() {
  console.log("Welcome to the Peril client!");
  console.log("Please enter your username:");
  const words = getInput();
  if (words.length === 0) {
    console.error("You must enter a username. Goodbye.");
    return [null, new Error("you must enter a username. goodbye")];
  }
  const username = words;
  console.log(`Welcome, ${username}!`);
  printClientHelp();
  return [username, null];
}

function printServerHelp() {
  console.log("Possible commands:");
  console.log("* pause");
  console.log("* resume");
  console.log("* quit");
  console.log("* help");
}

function getInput() {
  return prompt("> ").split(" ")[0];
}

function getMaliciousLog() {
  const possibleLogs = [
    "Never interrupt your enemy when he is making a mistake.",
    "The hardest thing of all for a soldier is to retreat.",
    "A soldier will fight long and hard for a bit of colored ribbon.",
    "It is well that war is so terrible, otherwise we should grow too fond of it.",
    "The art of war is simple enough. Find out where your enemy is. Get at him as soon as you can. Strike him as hard as you can, and keep moving on.",
    "All warfare is based on deception.",
  ];
  const randomIndex = randomInt(possibleLogs.length);
  return possibleLogs[randomIndex];
}

function printQuit() {
  console.log("I hate this game! (╯°□°)╯︵ ┻━┻");
}

class GameState {
  constructor(paused, player) {
    this.paused = paused;
    this.player = player;
  }

  isPaused() {
    return this.paused;
  }

  getPlayerSnap() {
    return this.player;
  }

  commandStatus() {
    if (this.isPaused()) {
      console.log("The game is paused.");
      return;
    } else {
      console.log("The game is not paused.");
    }

    const player = this.getPlayerSnap();
    console.log(
      `You are ${player.username}, and you have ${player.units.size} units.`
    );
    for (const [id, unit] of player.units.entries()) {
      console.log(`* ${id}: ${unit.location}, ${unit.rank}`);
    }
  }
}

module.exports = {
  printClientHelp,
  clientWelcome,
  printServerHelp,
  getInput,
  getMaliciousLog,
  printQuit,
  GameState,
};

const { randomInt } = require("crypto");
const readline = require("readline");

// const prompt = require("prompt-sync")({ sigint: true });

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

async function clientWelcome() {
  console.log("Welcome to the Peril client!");
  console.log("Please enter your username:");
  const words = await getInput();
  if (words.length === 0) {
    console.error("You must enter a username. Goodbye.");
    return [null, new Error("you must enter a username. goodbye")];
  }
  const username = words[0];
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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // const requestInput = async function () {
  //   const url = await new Promise((resolve) => {
  //     rl.question("Please type url: ", resolve);
  //   });
  // };

  // return requestInput();

  const requestInput = () => {
    return new Promise((resolve) => {
      rl.question("> ", (input) => {
        rl.close();
        const inputArray = input.split(" "); // Split input by spaces into an array
        resolve(inputArray);
      });
    });
  };

  return requestInput();
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

module.exports = {
  printClientHelp,
  clientWelcome,
  printServerHelp,
  getInput,
  getMaliciousLog,
  printQuit,
};

const gamelogic = require("./../../internal/gamelogic");
const amqp = require("amqplib");
const readline = require("readline");
const {
  publishJSON,
  DeclareAndBind,
  SubscribeJSON,
} = require("../../internal/pubsub");
const { routing, models } = require("./../../internal/routings");

const connectionString = "amqp://guest:guest@localhost:5672/";

function handlerPause(gameState) {
  return function (playingState) {
    console.log("handling pause");
    try {
      gameState.handlePause(playingState);
    } catch (err) {
      console.error("Error handling pause:", err);
    } finally {
      console.log("\n> ");
    }
  };
}

function handlerMove(gameState) {
  return function (move) {
    try {
      console.log("handling move");
      gameState.handleMove(move);
    } catch (err) {
      console.error("Error handling move:", err);
    } finally {
      console.log("\n> ");
    }
  };
}

async function main() {
  try {
    const [username, error] = await gamelogic.clientWelcome();
    if (error) return;
    const connection = await amqp.connect(connectionString);
    console.log("Connection successful");

    await DeclareAndBind(
      connection,
      routing.EXCHANGE_PERIL_DIRECT,
      `${routing.PAUSE_KEY}.${username}`,
      routing.PAUSE_KEY,
      "transient"
    );

    await DeclareAndBind(
      connection,
      routing.EXCHANGE_PERIL_TOPIC,
      routing.GAME_LOG_SLUG,
      `${routing.GAME_LOG_SLUG}.${username}`,
      "durable"
    );

    await DeclareAndBind(
      connection,
      routing.EXCHANGE_PERIL_TOPIC,
      `${routing.ARMY_MOVES_PREFIX}.${username}`,
      `${routing.ARMY_MOVES_PREFIX}.*`,
      "transient"
    );

    const GameState = new gamelogic.GameState(username);

    await SubscribeJSON(
      connection,
      routing.EXCHANGE_PERIL_TOPIC,
      `${routing.PAUSE_KEY}.${username}`,
      routing.PAUSE_KEY,
      "transient",
      handlerPause(GameState)
    );

    await SubscribeJSON(
      connection,
      routing.EXCHANGE_PERIL_TOPIC,
      `${routing.ARMY_MOVES_PREFIX}.${username}`,
      `${routing.ARMY_MOVES_PREFIX}.*`,
      "transient",
      handlerMove(GameState)
    );

    let continueLoop = true;
    while (continueLoop) {
      const words = await gamelogic.getInput();
      if (words.length === 1 && words[0] === "") continue;

      switch (words[0]) {
        case "spawn":
          try {
            GameState.commandSpawn(words);
          } catch (e) {
            console.log(e.message);
          }
          break;
        case "move":
          try {
            const move = GameState.commandMove(words);
            publishJSON(
              await connection.createChannel(),
              routing.EXCHANGE_PERIL_TOPIC,
              `${routing.ARMY_MOVES_PREFIX}.${username}`,
              move
            );
            console.log("Move successfully published");
          } catch (e) {
            console.log(e.message);
          }
          break;
        case "status":
          try {
            GameState.commandStatus();
          } catch (e) {
            console.log(e.message);
          }
          break;
        case "help":
          try {
            gamelogic.printClientHelp();
          } catch (e) {
            console.log(e.message);
          }
          break;
        case "spam":
          try {
            console.log("Spamming not allowed yet");
          } catch (e) {
            console.log(e.message);
          }
          break;
        case "quit":
          console.log("exiting...");
          continueLoop = false;
          break;
        default:
          console.log("That is not a valid command");
          break;
      }
    }

    // Close the connection on process exit
    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      await connection.close();
      process.exit(0);
    });

    // Wait for a signal to exit
    console.log("Waiting for a signal to exit...");
    // Just keep the process running
    await new Promise((resolve) => process.on("SIGINT", resolve));
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
}

main();
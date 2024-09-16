const gamelogic = require("./../../internal/gamelogic");
const amqp = require("amqplib");
const fs = require("node:fs/promises");
const path = require("node:path");

const {
  publishJSON,
  DeclareAndBind,
  SubscribeJSON,
  AckType,
} = require("../../internal/pubsub");
const { routing, models } = require("./../../internal/routings");

const connectionString = "amqp://guest:guest@localhost:5672/";

function handlerPause(gameState) {
  return function (playingState) {
    console.log("handling pause");
    try {
      gameState.handlePause(playingState);
      return AckType.Ack;
    } catch (err) {
      console.error("Error handling pause:", err);
    } finally {
      console.log("\n> ");
    }
  };
}

function handlerMove(gameState, connection, username) {
  return async function (move) {
    try {
      console.log("handling move");
      const moveOutcome = gameState.handleMove(move);
      if (moveOutcome === gamelogic.MoveOutcome.Safe) {
        return AckType.Ack;
      }
      if (moveOutcome === gamelogic.MoveOutcome.MakeWar) {
        const attacker = move.player;
        const defender = gameState.getPlayerSnap();

        const published = await publishJSON(
          await connection.createChannel(),
          routing.EXCHANGE_PERIL_TOPIC,
          `${routing.WAR_RECOGNITIONS_PREFIX}.${username}`,
          { attacker, defender }
        );
        if (published) return AckType.Ack;
        return AckType.NackRequeue;
      }
      return AckType.NackDiscard;
    } catch (err) {
      console.error("Error handling move:", err);
    } finally {
      console.log("\n> ");
    }
  };
}

function handlerWar(gameState, connection, username) {
  return async function (wr) {
    try {
      console.log("handling war");
      const warOutcome = gameState.handleWar(wr);

      if (warOutcome[0] === gamelogic.WarOutcome.NotInvolved) {
        console.log("requeuing");
        return AckType.NackRequeue;
      }
      const publishLogMessage = async (msg) => {
        const published = await publishJSON(
          await connection.createChannel(),
          routing.EXCHANGE_PERIL_TOPIC,
          `${routing.GAME_LOG_SLUG}.${username}`,
          msg
        );
        if (published) console.log("Successfully published log message");
      };
      const handleWarOutcome = (outcome, winner, loser) => {
        const messages = {
          [gamelogic.WarOutcome.YouWon]: `${winner} won a war against ${loser}`,
          [gamelogic.WarOutcome
            .OpponentWon]: `${loser} won a war against ${winner}`,
          [gamelogic.WarOutcome
            .Draw]: `War between ${winner} and ${loser} ended in a draw`,
        };
        return messages[outcome];
      };

      const logMessage = handleWarOutcome(
        warOutcome[0],
        warOutcome[1],
        warOutcome[2]
      );
      if (logMessage) {
        await publishLogMessage(logMessage);
        return AckType.Ack;
      }

      return AckType.NackDiscard;
    } catch (err) {
      console.error("Error handling move:", err);
    } finally {
      console.log("\n> ");
    }
  };
}

function handlerLog() {
  return async function (msg) {
    await fs.appendFile(path.join(__dirname, "war.log"), msg);
    console.log("Successfully appended log to log file");
    return AckType.Ack;
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
      routing.WAR_RECOGNITIONS_PREFIX,
      `${routing.WAR_RECOGNITIONS_PREFIX}.${username}`,
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
      handlerMove(GameState, connection, username)
    );

    await SubscribeJSON(
      connection,
      routing.EXCHANGE_PERIL_TOPIC,
      routing.WAR_RECOGNITIONS_PREFIX,
      `${routing.WAR_RECOGNITIONS_PREFIX}.${username}`,
      "durable",
      handlerWar(GameState, connection, username)
    );

    await SubscribeJSON(
      connection,
      routing.EXCHANGE_PERIL_TOPIC,
      routing.GAME_LOG_SLUG,
      `${routing.GAME_LOG_SLUG}.*`,
      "durable",
      handlerLog(GameState)
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
            await publishJSON(
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
            if (words[1] === "" || isNaN(Number(words[1]))) {
              console.log("Provide valid arguments");
              continue;
            }
            console.log("Spamming logs");
            for (let i = 0; i < words[1]; i++) {
              const maliciousLog = gamelogic.getMaliciousLog();
              await publishJSON(
                await connection.createChannel(),
                routing.EXCHANGE_PERIL_TOPIC,
                `${routing.GAME_LOG_SLUG}.${username}`,
                maliciousLog
              );
            }
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

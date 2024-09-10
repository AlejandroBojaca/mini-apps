const amqp = require("amqplib");
const { publishJSON } = require("../../internal/pubsub");
const { routing, models } = require("./../../internal/routings");
const gamelogic = require("./../../internal/gamelogic");

const connectionString = "amqp://guest:guest@localhost:5672/";

async function main() {
  try {
    // Connect to RabbitMQ server
    gamelogic.printServerHelp();
    const connection = await amqp.connect(connectionString);

    const channel = await connection.createChannel();
    const PlayingState = new models.PlayingState(true);

    let continueLoop = true;
    while (continueLoop) {
      const word = gamelogic.getInput();
      if (!word || word.length === 0) continue;
      switch (word) {
        case "pause":
          console.log("sending pause message");
          PlayingState.changeState(true);
          publishJSON(
            channel,
            routing.EXCHANGE_PERIL_DIRECT,
            routing.PAUSE_KEY,
            PlayingState
          );
          break;
        case "resume":
          console.log("sending resume message");
          PlayingState.changeState(false);
          publishJSON(
            channel,
            routing.EXCHANGE_PERIL_DIRECT,
            routing.PAUSE_KEY,
            PlayingState
          );
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
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
}

main();

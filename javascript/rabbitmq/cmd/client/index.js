const gamelogic = require("./../../internal/gamelogic");
const amqp = require("amqplib");
const { publishJSON, DeclareAndBind } = require("../../internal/pubsub");
const { routing, models } = require("./../../internal/routings");

const connectionString = "amqp://guest:guest@localhost:5672/";

async function main() {
  try {
    const [username, error] = gamelogic.clientWelcome();
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

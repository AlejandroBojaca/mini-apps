async function DeclareAndBind(
  connection,
  exchange,
  queueName,
  routingKey,
  simpleQueueType
) {
  const channel = await connection.createChannel();

  const queue = await channel.assertQueue(queueName, {
    durable: simpleQueueType === "durable", // Durable if simpleQueueType is 'durable'
    autoDelete: simpleQueueType === "transient", // Auto-delete if simpleQueueType is 'transient'
    // exclusive: simpleQueueType === "transient", // Exclusive if simpleQueueType is 'transient'
    noWait: false,
    arguments: null,
  });

  // Bind the queue to the exchange
  await channel.bindQueue(queue.queue, exchange, routingKey); //queue.queue

  // Return the channel and queue
  return { channel, queue };
}

async function publishJSON(channel, exchange, key, val) {
  try {
    const jsonBytes = Buffer.from(JSON.stringify(val), "utf-8");

    await channel.publish(exchange, key, jsonBytes, {
      contentType: "application/json",
      persistent: false,
    });

    console.log(
      `Message published to exchange ${exchange} with routing key ${key}`
    );
  } catch (err) {
    console.error("Failed to publish message:", err);
    throw err;
  }
}

async function SubscribeJSON(
  connection,
  exchange,
  queueName,
  key,
  simpleQueueType,
  handler
) {
  try {
    const { channel, queue } = await DeclareAndBind(
      connection,
      exchange,
      queueName,
      key,
      simpleQueueType
    );
    const consumerTag = await channel.consume(queue.queue, (message) => {
      console.log("message incoming");
      if (message !== null) {
        try {
          const parsedMessage = JSON.parse(message.content.toString());
          handler(parsedMessage);
          channel.ack(message);
        } catch (err) {
          console.error("Failed to handle message:", err);
        }
      }
    });

    return consumerTag;
  } catch (err) {
    console.error("Failed to subscribe to JSON messages:", err);
    throw err;
  }
}

module.exports = { publishJSON, DeclareAndBind, SubscribeJSON };

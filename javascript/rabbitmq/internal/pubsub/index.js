const AckType = {
  Ack: "Ack",
  NackRequeue: "NackRequeue",
  NackDiscard: "NackDiscard",
};

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

    const res = await channel.publish(exchange, key, jsonBytes, {
      contentType: "application/json",
      persistent: false,
    });

    console.log(
      `Message published to exchange ${exchange} with routing key ${key}`
    );

    return res;
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

    const consumerTag = await channel.consume(queue.queue, async (message) => {
      console.log("message incoming");
      if (message !== null) {
        try {
          const parsedMessage = JSON.parse(message.content.toString());
          const ackType = await handler(parsedMessage);

          switch (ackType) {
            case AckType.Ack:
              console.log("Acking message");
              channel.ack(message);
              break;
            case AckType.NackRequeue:
              console.log("Nacking and requeuing message");
              channel.nack(message, false, true);
              break;
            case AckType.NackDiscard:
              console.log("Nacking and discarding message");
              channel.nack(message, false, false);
              break;
            default:
              console.error("Unknown ackType, discarding message");
              channel.nack(message, false, false);
              break;
          }
        } catch (err) {
          console.error("Failed to handle message:", err);
          channel.nack(message, false, true); // Requeue on error
        }
      }
    });

    return consumerTag;
  } catch (err) {
    console.error("Failed to subscribe to JSON messages:", err);
    throw err;
  }
}

module.exports = { publishJSON, DeclareAndBind, SubscribeJSON, AckType };

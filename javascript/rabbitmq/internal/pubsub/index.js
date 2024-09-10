async function publishJSON(channel, exchange, key, val) {
  try {
    // Convert the value to JSON bytes
    const jsonBytes = Buffer.from(JSON.stringify(val), "utf-8");

    // Publish the JSON message to the exchange with the routing key
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

async function DeclareAndBind(
  connection,
  exchange,
  queueName,
  routingKey,
  simpleQueueType
) {
  const channel = await connection.createChannel();

  // Declare a new queue
  const queue = await channel.assertQueue(queueName, {
    durable: simpleQueueType === "durable", // Durable if simpleQueueType is 'durable'
    autoDelete: simpleQueueType === "transient", // Auto-delete if simpleQueueType is 'transient'
    exclusive: simpleQueueType === "transient", // Exclusive if simpleQueueType is 'transient'
    noWait: false,
    arguments: null,
  });

  // Bind the queue to the exchange
  await channel.bindQueue(queue.queue, exchange, routingKey);

  // Return the channel and queue
  return { channel, queue };
}

module.exports = { publishJSON, DeclareAndBind };

const axios = require("axios");

async function sendMessage(token, chatId, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: message,
  };

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

const token = "token";
const chatId = "chatId";
const message = "Hello, this is a test message from my bot!";

sendMessage(token, chatId, message)
  .then((data) => console.log(data))
  .catch(console.error);

const axios = require("axios");

const getUpdates = async (token) => {
  try {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

const token = "token";
getUpdates(token).then((updates) => {
  if (updates) {
    for (let update of updates.result) {
      console.log(update.message.chat.id);
    }
  }
});

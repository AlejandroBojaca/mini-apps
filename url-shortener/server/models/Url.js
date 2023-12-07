const mongoose = require("mongoose");

const UrlSchema = mongoose.Schema({
  url: String,
  shortenedUrl: String,
});

module.exports = new mongoose.model("urls", UrlSchema);

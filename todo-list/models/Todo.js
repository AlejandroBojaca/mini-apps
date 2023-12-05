const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
  todo: {
    type: String,
  },
});

module.exports = new mongoose.model("Todo", TodoSchema);

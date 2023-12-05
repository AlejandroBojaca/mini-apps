const express = require("express");

const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todo_list", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(require("./routes"));
app.use(require("./routes/todo"));

app.listen(3000, () => console.log("Server started on port 3000"));

const Todo = require("../models/Todo");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const allTodos = await Todo.find();
  res.render("index", { allTodos });
});

module.exports = router;

const router = require("express").Router();
const Todo = require("../models/Todo");

router.post("/add/todo", async (req, res) => {
  const { todo } = req.body;

  try {
    const newTodo = new Todo({ todo });
    await newTodo.save();
    res.redirect("/");
  } catch {
    res.render("ERROR");
  }
});

router.get("/delete/todo/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    await Todo.deleteOne({ _id });
    res.redirect("/");
  } catch {
    res.render("Error deleting todo");
  }
});

module.exports = router;

const Todo = require("../models/Todo");

function errorHandling(res, error) {
  res.status(500).send({ message: error.message || "Error Occured" });
}

module.exports = {
  getTodos: async (req, res) => {
    try {
      let todoItems, itemsLeft, isSearch;
      if (!req.query.searchTerm) {
        todoItems = await Todo.find({ userId: req.user.id });
        itemsLeft = await Todo.countDocuments({
          userId: req.user.id,
          completed: false,
        });
        isSearch = false;
      } else {
        todoItems = await Todo.find({
          userId: req.user.id,
          $text: { $search: req.query.searchTerm, $diacriticSensitive: true },
        });
        itemsLeft = null;
        isSearch = true;
      }
      res.render("todos.ejs", {
        todos: todoItems,
        left: itemsLeft,
        user: req.user,
        isSearch,
      });
    } catch (err) {
      errorHandling(res, err);
    }
  },
  searchTodo: async (req, res) => {
    try {
      let searchTerm = req.query.searchTerm;
      let foundItems = await Todo.find({
        $text: { $search: searchTerm, $diacriticSensitive: true },
      });
      console.log(foundItems);
      res.render("todos.ejs", {
        todos: foundItems,
        left: null,
        user: req.user,
      });
    } catch (error) {
      errorHandling(res, error);
    }
  },
  createTodo: async (req, res) => {
    try {
      await Todo.create({
        todo: req.body.todoItem,
        completed: false,
        userId: req.user.id,
      });
      console.log("Todo has been added!");
      res.redirect("/todos");
    } catch (err) {
      errorHandling(res, error);
    }
  },
  updateTodo: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          todo: req.body.textInput,
        }
      );
      console.log("Updated Todo");
      res.json("Updated It");
    } catch (err) {
      errorHandling(res, error);
    }
  },
  markComplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: true,
        }
      );
      console.log("Marked Complete");
      res.json("Marked Complete");
    } catch (err) {
      errorHandling(res, error);
    }
  },
  markIncomplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: false,
        }
      );
      console.log("Marked Incomplete");
      res.json("Marked Incomplete");
    } catch (err) {
      errorHandling(res, error);
    }
  },
  deleteTodo: async (req, res) => {
    console.log(req.body.todoIdFromJSFile);
    try {
      await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile });
      console.log("Deleted Todo");
      res.json("Deleted It");
    } catch (err) {
      errorHandling(res, error);
    }
  },
};

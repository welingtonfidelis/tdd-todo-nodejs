const TodoModel = require("../models/todo.model");

exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);
  } catch (error) {
    next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.todoId);
    
    if(!todo) return res.status(404).send();
    
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, {
      new: true,
      useFindAndModify: false
    });
    
    if(!todo) return res.status(404).send();
    
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};


exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await TodoModel.findByIdAndDelete(req.params.todoId);
    
    if(!todo) return res.status(404).send();
    
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

const Todo = require("../models/Task");

const getTasks = async (search = "") => {
  const filter = {};

  if (search.trim()) {
    filter.text = {
      $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  }

  return Todo.find(filter).sort({ createdAt: -1 });
};

const createTask = async (data) => Todo.create(data);

const updateTask = async (id, data) =>
  Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

const deleteTask = async (id) => Todo.findByIdAndDelete(id);

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

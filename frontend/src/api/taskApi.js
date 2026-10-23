
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export const getTasks = (search = "") =>
  api.get("/tasks", { params: { search } });

export const addTask = (task) =>
  api.post("/tasks", task);

export const editTask = (id, task) =>
  api.put(`/tasks/${id}`, task);

export const updateTaskStatus = (id, completed) =>
  api.patch(`/tasks/${id}/status`, { completed });

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

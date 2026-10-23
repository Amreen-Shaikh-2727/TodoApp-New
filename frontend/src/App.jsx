
import { useEffect, useState, useCallback } from "react";
import {
  getTasks,
  addTask,
  editTask,
  updateTaskStatus,
  deleteTask,
} from "./api/taskApi";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTasks(search);
      setTasks(response.data);
    } catch {
      setError("Unable to load tasks. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadTasks]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setError("Please enter a task.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await editTask(editingId, { text: text.trim(), priority });
        setEditingId(null);
      } else {
        await addTask({ text: text.trim(), priority });
      }

      setText("");
      setPriority("medium");
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save the task.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setText(task.text);
    setPriority(task.priority);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatus = async (task) => {
    setError("");

    try {
      await updateTaskStatus(task._id, !task.completed);
      await loadTasks();
    } catch {
      setError("Unable to update task status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setError("");

    try {
      await deleteTask(id);
      await loadTasks();
    } catch {
      setError("Unable to delete the task.");
    }
  };

  const visibleTasks = tasks.filter(
    (task) => filter === "all" || task.priority === filter
  );

  return (
    <div className="app">
      <header className="header">
        <h1>My Todo List</h1>
        <p>Organize your daily tasks</p>
      </header>

      <main className="container">
        <section className="todo-card">
          <h2>{editingId ? "Edit Task" : "My Tasks"}</h2>

          <form className="task-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter a task..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={200}
              aria-label="Task description"
            />

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              aria-label="Task priority"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditingId(null);
                  setText("");
                  setPriority("medium");
                  setError("");
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="toolbar">
            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search tasks"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter tasks by priority"
            >
              <option value="all">All priorities</option>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
              <button type="button" onClick={loadTasks}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <p className="message">Loading tasks...</p>
          ) : visibleTasks.length === 0 ? (
            <p className="message">
              {search ? "No matching tasks found." : "No tasks found. Add one above!"}
            </p>
          ) : (
            <ul className="task-list">
              {visibleTasks.map((task) => (
                <li
                  key={task._id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <label className="task-description">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleStatus(task)}
                    />
                    <span>{task.text}</span>
                  </label>

                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="task-count">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} loaded
          </p>
        </section>
      </main>

      <footer className="footer">
        Todo App · Built with React and MongoDB
      </footer>
    </div>
  );
}

export default App;

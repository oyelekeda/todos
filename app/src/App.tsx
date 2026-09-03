import { useState, useEffect } from "react";
import "./App.css";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

 
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
   
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = () => {
    if (task.trim() === "") return;

    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: task } : todo,
        ),
      );

      setEditId(null);
      setTask("");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask("");
  };

  const handleEdit = (todo: Todo) => {
    setTask(todo.text);
    setEditId(todo.id);
  };

  const handleCancel = () => {
    setTask("");
    setEditId(null);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    const newtodo = todos.filter((todo) => todo.id !== id);
    setTodos(newtodo);

    if (editId === id) {
      setEditId(null);
      setTask("");
    }
  };

  const total = todos.length;

  const completed = todos.filter((todo) => todo.completed).length;

  const active = todos.filter((todo) => !todo.completed).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div>
            <p className="eyebrow">MY TASKS</p>

            <h1>Todo List</h1>

            <p className="subtitle">Stay organized and get things done.</p>
          </div>

          <div className="total-circle">
            <strong>{total}</strong>
            <span>Total</span>
          </div>
        </header>

        <div className="input-area">
          <input
            type="text"
            placeholder={
              editId !== null ? "Edit your task..." : "What needs to be done?"
            }
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />

          <button className="add-btn" onClick={handleSubmit}>
            {editId !== null ? "Update" : "+ Add Task"}
          </button>

          {editId !== null && (
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon total">#</div>

            <div>
              <p>Total</p>
              <strong>{total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">✓</div>

            <div>
              <p>Completed</p>
              <strong>{completed}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active">○</div>

            <div>
              <p>Active</p>
              <strong>{active}</strong>
            </div>
          </div>
        </div>

        <div className="task-header">
          <h2>Your Tasks</h2>

          <span>{active} remaining</span>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>

              <h3>No tasks yet</h3>

              <p>Add your first task above and start being productive.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                className={`todo-item ${
                  todo.completed ? "completed-item" : ""
                }`}
                key={todo.id}
              >
                <div className="todo-info">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />

                  <div className="task-details">
                    <span className="task-text">{todo.text}</span>

                    <span
                      className={`badge ${
                        todo.completed ? "completed-badge" : "active-badge"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Active"}
                    </span>
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(todo)}
                    title="Edit"
                  >
                    ✎
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="progress-section">
            <div className="progress-top">
              <span>
                {completed} of {total} tasks completed
              </span>

              <strong>{progress}%</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

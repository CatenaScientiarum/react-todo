import React, { useCallback, useEffect, useMemo, useState } from "react";
import Title from "../Title/title";
import Container from "../Container/container";
import Form from "../Form/form";
import TodoList from "../TodoList/todoList";
import "./app.css";

const STORAGE_KEY = "my_todos_v3";
const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [tagFilter, setTagFilter] = useState("");
  const [viewCompleted, setViewCompleted] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((payload) => {
    const newTodo = {
      id: Date.now().toString(),
      text: payload.text.trim(),
      description: payload.description?.trim() || "",
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: payload.deadline || null,
      priority: payload.priority || "medium",
      tags: payload.tags || []
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const removeTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const restoreTodo = useCallback((id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: false } : t)));
  }, []);

  const editTodo = useCallback((id, updates) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const allTags = useMemo(() => {
    const set = new Set();
    todos.forEach((t) => (t.tags || []).forEach((tg) => set.add(tg)));
    return Array.from(set).sort();
  }, [todos]);

  const sortedTodos = useMemo(() => {
    const copy = [...todos];
    const order = sortOrder === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      if (sortBy === "createdAt") {
        return order * (new Date(a.createdAt) - new Date(b.createdAt));
      }
      if (sortBy === "deadline") {
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return order * (da - db);
      }
      if (sortBy === "priority") {
        return order * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      }
      return 0;
    });
    return copy;
  }, [todos, sortBy, sortOrder]);

  const activeTodos = useMemo(() => {
    return sortedTodos.filter((t) => !t.completed && (tagFilter === "" || t.tags.includes(tagFilter)));
  }, [sortedTodos, tagFilter]);

  const completedTodos = useMemo(() => {
    return sortedTodos.filter((t) => t.completed && (tagFilter === "" || t.tags.includes(tagFilter)));
  }, [sortedTodos, tagFilter]);

  return (
    <div className="app">
      <Container>
        <div className="title-wrap">
          <Title>Todo</Title>
        </div>

        <div className="form-wrap">
          <Form saveTodo={addTodo} />
        </div>

        <div className="controls" style={{ marginBottom: 18 }}>
          <div className="control-group">
            <label htmlFor="sortBy">Sort by</label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Created</option>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="control-group">
            <label>Order</label>
            <button className="small" onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}>
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>

          <div className="control-group">
            <label htmlFor="tagFilter">Tag</label>
            <select id="tagFilter" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="">All tags</option>
              {allTags.map((tg) => (
                <option key={tg} value={tg}>
                  {tg}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group grow" style={{ marginLeft: "auto" }}>
            <button className="small" onClick={() => setViewCompleted((v) => !v)}>
              {viewCompleted ? "Show active" : `Show completed (${completedTodos.length})`}
            </button>
            <button
              className="small"
              onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
              title="Remove all completed permanently"
              style={{ marginLeft: 8 }}
            >
              Clear completed
            </button>
          </div>
        </div>

        {!viewCompleted ? (
          <TodoList
            todos={activeTodos}
            onRemove={removeTodo}
            onToggleComplete={toggleComplete}
            onEdit={editTodo}
          />
        ) : (
          <>
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)" }}>Completed tasks</div>
            <TodoList
              todos={completedTodos}
              onRemove={removeTodo}
              onToggleComplete={toggleComplete}
              onEdit={editTodo}
              onRestore={restoreTodo}
            />
          </>
        )}
      </Container>
    </div>
  );
}

export default App;

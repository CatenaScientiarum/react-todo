import React, { useState, forwardRef } from "react";
import "./todoListItem.css";
import Button from "../Button/button";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';




const formatDeadline = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
};

const isDeadlineValid = (deadlineLocalValue) => {
  if (!deadlineLocalValue) return true;
  const deadline = new Date(deadlineLocalValue);
  const now = new Date();
  return deadline.getTime() >= now.getTime();
};

const TodoListItem = forwardRef(({ todo, onRemove, onToggleComplete, onEdit, onRestore }, ref) => {
  const [isEditing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editDeadline, setEditDeadline] = useState(todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : "");
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editTags, setEditTags] = useState((todo.tags || []).join(", "));
  const [error, setError] = useState("");

  const save = () => {
    if (!editValue.trim()) {
      setError("Title cannot be empty");
      return;
    }
    if (!isDeadlineValid(editDeadline)) {
      setError("Deadline cannot be in the past");
      return;
    }
    const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    onEdit(todo.id, {
      text: editValue.trim(),
      description: editDescription.trim(),
      deadline: editDeadline ? new Date(editDeadline).toISOString() : null,
      priority: editPriority,
      tags
    });
    setEditing(false);
    setError("");
  };

  return (
    <li ref={ref} className="todo-list-item">
      <div className="left">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          aria-label={`Mark ${todo.text} as completed`}
        />
        <div className="main">
          {isEditing ? (
            <>
              <input className="edit-input" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
              <textarea className="edit-textarea" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </>
          ) : (
            <>
              <div className={`text ${todo.completed ? "completed" : ""}`}>{todo.text}</div>
              {todo.description && <div className="task-desc">{todo.description}</div>}
            </>
          )}

          <div className="meta">
            <span className={`priority ${todo.priority}`}>{todo.priority}</span>
            {todo.deadline && <span className="deadline">Due: {formatDeadline(todo.deadline)}</span>}
            {todo.tags && todo.tags.length > 0 && (
              <div className="tags">
                {todo.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="actions">
        {isEditing ? (
          <>
            <input
              className="input small-input"
              type="datetime-local"
              value={editDeadline}
              onChange={(e) => {
                setEditDeadline(e.target.value);
                if (!isDeadlineValid(e.target.value)) setError("Deadline cannot be in the past");
                else setError("");
              }}
            />
            <select className="input small-input" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input className="input small-input" value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="tags" />

            <Button type="success" onClick={save}>Save</Button>
            <Button onClick={() => { setEditing(false); setEditValue(todo.text); setEditDescription(todo.description || ""); setError(""); }}>Cancel</Button>
            {error && <div className="item-error">{error}</div>}
          </>
        ) : (
          <>
            {todo.completed && onRestore ? (
              <>
                <Button onClick={() => onRestore(todo.id)}>Restore</Button>
                <Button type="error" onClick={() => onRemove(todo.id)}>Remove</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditing(true)}>Edit</Button>
                <Button type="error" onClick={() => onRemove(todo.id)}>Remove</Button>
              </>
            )}
          </>
        )}
      </div>
    </li>
  );
});

export default React.memo(TodoListItem);

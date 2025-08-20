import React, { useState } from "react";
import Input from "../Input/input";
import Button from "../Button/button";
import "./form.css";


const isDeadlineValid = (deadlineLocalValue) => {
  if (!deadlineLocalValue) return true;
  // deadlineLocalValue format: "YYYY-MM-DDTHH:MM"
  const deadline = new Date(deadlineLocalValue);
  const now = new Date();
  return deadline.getTime() >= now.getTime();
};

const Form = ({ saveTodo }) => {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tagsStr, setTagsStr] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) {
      setError("Please enter title");
      return;
    }
    if (!isDeadlineValid(deadline)) {
      setError("Deadline cannot be in the past");
      return;
    }
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    saveTodo({
      text,
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      priority,
      tags
    });

    setValue("");
    setDescription("");
    setDeadline("");
    setPriority("medium");
    setTagsStr("");
    setError("");
  };

  return (
    <form className="form-extended" onSubmit={onSubmit} noValidate>
      <div className="main-inputs">
        <Input
          name="todo"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Create a new todo..."
          aria-label="Create a new todo"
        />
        <textarea
          className="input textarea-desc"
          placeholder="Optional description (details about the task)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Task description"
        />
      </div>

      <div className="small-inputs-and-action">
        <div className="small-inputs">
          <input
            className="input small-input"
            type="datetime-local"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              if (!isDeadlineValid(e.target.value)) setError("Deadline cannot be in the past");
              else setError("");
            }}
            aria-label="Deadline"
          />
          <select className="input small-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">High priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            className="input small-input"
            type="text"
            placeholder="tags (comma separated)"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            aria-label="Tags"
          />
        </div>

        <div className="action">
          <Button type="success" disabled={!value.trim() || !!error}>
            Add +
          </Button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default Form;

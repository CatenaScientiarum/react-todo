import React, { useRef } from "react";
import TodoListItem from "../TodoListItem/todoListItem";
import "./todoList.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const TodoList = ({ todos, onRemove, onToggleComplete, onEdit, onRestore }) => {
  const nodeRefs = useRef(new Map()); 

  if (!todos || todos.length === 0) {
    return <div className="empty">No todos yet — add your first task</div>;
  }

  return (
    <ul className="todo-list">
      <TransitionGroup component={null}>
        {todos.map((todo) => {
          let nodeRef = nodeRefs.current.get(todo.id);
          if (!nodeRef) {
            nodeRef = React.createRef();
            nodeRefs.current.set(todo.id, nodeRef);
          }

          return (
            <CSSTransition key={todo.id} nodeRef={nodeRef} timeout={300} classNames="todo-item" unmountOnExit>
              <TodoListItem
                ref={nodeRef}
                todo={todo}
                onRemove={onRemove}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onRestore={onRestore} // may be undefined for active list
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </ul>
  );
};

export default React.memo(TodoList);

import TodoListItem from "../TodoListItem/todoListItem";
import './todoList.css';
const TodoList = (props) => {
const {todos, removeTodo} = props;
if (todos.length === 0) {
return null;
}
return (
<ul className={'todo-list'}>
{
todos.map(
(todoText, index) => {
return <TodoListItem
removeTodo={() => removeTodo(index)}
key={index}
>
{todoText}
</TodoListItem>;
}
)
}
</ul>
)
};
export default TodoList;
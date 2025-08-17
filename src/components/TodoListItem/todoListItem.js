import './todoListItem.css';
import Button from "../Button/button";
const TodoListItem = (props) => {
const {children, removeTodo} = props;
return (
<li className={'todo-list-item'}>
<div className={'content'}>
{children}
</div>
<div className={'actions'}>
<Button type={'error'} onClick={removeTodo}>Remove</Button>
</div>
</li>
)
};
export default TodoListItem;
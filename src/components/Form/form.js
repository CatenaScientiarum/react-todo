import {useState} from "react";
import Input from "../Input/input";
import Button from "../Button/button";
import './form.css';
const Form = (props) => {
const {saveTodo} = props;
const [value, setValue] = useState('');
return (
<form
className={'form'}
onSubmit={
(event) => {
event.preventDefault();
if (value !== '') {
saveTodo(value);
setValue('');
}
}
}
>
<Input
name={'todo'}
onChange={
(event) => {
const value = event.target.value;
setValue(value);
}
}
value={value}
placeholder={'Create a new todo...'}
/>
<div className={'action'}>
<Button type={'success'}>Add +</Button>
</div>
</form>
)
};
export default Form;
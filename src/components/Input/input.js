import './input.css';
const Input = (props) => {
const {name, onChange, value, placeholder} = props;
return (
<input
className={'input'}
name={name}
type="text"
onChange={onChange}
value={value}
placeholder={placeholder ? placeholder: ''}
/>
);
};
export default Input;
import './input.css';
const Input = ({ id, name, onChange, value, placeholder, ...rest }) => {
  return (
    <input
      id={id}
      className={'input'}
      name={name}
      type="text"
      onChange={onChange}
      value={value}
      placeholder={placeholder || ''}
      {...rest}
    />
  );
};
export default Input;
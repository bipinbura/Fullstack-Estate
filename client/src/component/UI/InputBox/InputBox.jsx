

function InputBox({ 
  type='text',
  placeholder,
  id,
  onChange,
  value = '',
  defaultValue = '',
  required= undefined,
  min=undefined,
  max=undefined
}) {

  const isControlled = value !== undefined
  const className = type === 'checkbox' ? 'w-5' : 'border p-3 rounded-lg'
  const inputProps = {
    type,
    placeholder,
    id,
    onChange: isControlled ? onChange : undefined,
    className,
    required,
    maxLength: type !== 'checkbox' ? '62' : undefined,
    minLength: type !== 'checkbox' ? '3' : undefined,
    min:type === 'number' ? min : undefined,
    max:type === 'number' ? max : undefined,
  }

  if(type === 'checkbox') {
    inputProps.value = isControlled ? value : undefined
  } else {
    inputProps.value = isControlled ? value : undefined;
    inputProps.defaultValue = !isControlled ? defaultValue : undefined;

  }
  return (
    <>
       <input {...inputProps} />
    </>
  )
}

export default InputBox



function InputBox({ 
  type,
  placeholder,
  id,
  onChange,
  value = '',
  defaultValue = ''
}) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className="border p-3 rounded-lg"
        id={id}
        onChange={onChange}
        value={value || undefined}
        defaultValue={defaultValue} />
    </>
  )
}

export default InputBox

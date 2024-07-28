

function InputBox({type, placeholder, id ,onChange}) {
  return (
  <>
        <input type={type} placeholder={placeholder}
         className="border p-3 rounded-lg" id={id} onChange={onChange}/>
  </>
  )
}

export default InputBox

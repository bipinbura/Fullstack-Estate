

function TextArea({
    placeholder,
    id,
    required=undefined,
    onChange=()=>{}
}) {
  return (
       <>
       <textarea 
        placeholder={placeholder} 
        className="border p-3 rounded-lg"
        id={id}
        required={required}
        onChange={onChange}
        ></textarea>
       </>
  )
}

export default TextArea

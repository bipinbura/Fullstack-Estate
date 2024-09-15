import InputBox from "../InputBox/InputBox"

function CheckBox({
    id,
    label,
    checked=undefined,
    onChange,
    className = 'w-5'
}) {
  return (
        <>
        <div className="flex gap-2 items-center">
            <InputBox 
            type="checkbox"
            id={id}
            onChange={onChange}
            checked={checked}
            className={className}
            />
            <label htmlFor={id}>{label}</label>
        </div>
        </>
  )
}

export default CheckBox

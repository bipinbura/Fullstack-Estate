import InputBox from "../InputBox/InputBox"

function NumberBox({id, label, min, max, value,onChange, condition=null }) {
  return (
      <>
       <div className="flex items-center gap-2">
          <InputBox 
          type='number'
          id={id}
          required={true}
          className={'p-3 border border-gray-300 rounded-lg'}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          />
         <label htmlFor={id}>{label}</label>
         {condition && <span className="text-xs">($ / month)</span>}
       </div>
      </>
  )
}

export default NumberBox

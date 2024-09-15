import { FaSearch } from 'react-icons/fa'

function SearchField({onChange=()=>{}, value='', handleSubmit=()=>{}}) {
    function onInput (e){
     onChange(e.target.value)
    }
    return (
        <>
            <form 
            onSubmit={handleSubmit}
            className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input type="text"
                onChange={onInput}
                value={value}
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-24 sm:w-64" />
                <button>
                <FaSearch className='text-slate-600' />
                </button>
            </form>
        </>
    )
}

export default SearchField

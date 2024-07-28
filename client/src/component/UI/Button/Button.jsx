

function Button({text, load}) {
    return (
        <>
            <button disabled={load}
            type="submit"
                className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
             {load ? 'Loading....': `${text}` }  
            </button>
        </>
    )
}

export default Button

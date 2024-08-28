

function Button({
    text,
    load=null,
    onClick= undefined,
    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    }) {

        const type = onClick ? 'button' : 'submit'
    return (
        <>
            <button disabled={load}
            type={type}
            className={className}
            onClick={onClick}
            >
             {load ? 'Loading....': text }  
            </button>
        </>
    )
}

export default Button

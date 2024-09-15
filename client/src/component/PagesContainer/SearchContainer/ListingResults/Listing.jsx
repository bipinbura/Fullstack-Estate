import ListingItem from "../../../UI/ListingItem/ListingItem"


function Listing({
   loading,
   listing,
   onShowMoreClick=()=>{},
   showMore }) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
        Listing Results:
      </h1>
      <div className="p-7 flex flex-wrap gap-4">
         {!loading && listing.length === 0 && (<p className="text-xl text-slate-700">No listing found</p>)}
         {loading && (<p className="text-xl text-slate-700 text-center w-full">Loading...</p>)}
         {!loading && listing && 
         (listing.map((list)=>(<ListingItem key={list._id} listing={list}/>)
        ))
         }
         {showMore && (<button onClick={onShowMoreClick} className="text-green-700 hover:underline p-7 text-center w-full" >
                Show More
         </button>)}
      </div>
    </div>
  )
}

export default Listing

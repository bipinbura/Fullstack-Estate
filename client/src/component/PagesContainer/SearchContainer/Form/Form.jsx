
import CheckBox from "../../../UI/CheckBox/CheckBox"
import Button from "../../../UI/Button/Button"
import InputBox from "../../../UI/InputBox/InputBox"


function Form({
  onInput=()=>{},
  onSubmit=()=>{},
  data=undefined
}) {

  function handleChange(e){

  const {id, value, checked} = e.target;
  const newData = {}

  if(['all', 'rent' ,'sale'].includes(id)){
    newData.type = id
  } else if (id === 'searchTerm'){
    newData.searchTerm = value;
  } else if(['parking', 'furnished', 'offer'].includes(id)){
    newData[id] = checked;
  } else if (id === 'sort_order'){
    const [sort= 'created_at', order='desc'] = value.split('_');
    newData.sort = sort;
    newData.order = order;
  }

  onInput(newData)
  }



  return (
    <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
       <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
          <label className="whitespace-nowrap font-semibold">
           Search Term:
           </label>
           <InputBox  placeholder={'Search...'} id={'searchTerm'} value={data.searchTerm} onChange={handleChange} />
           </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">type:</label>
            <CheckBox id={'all'} label={'Rent & Sale'} onChange={handleChange} checked={data.type === 'all'}/>
            <CheckBox id={'rent'} label={'Rent'} onChange={handleChange} checked={data.type === 'rent'}/>
            <CheckBox id={'sale'} label={'Sale'} onChange={handleChange} checked={data.type === 'sale'}/>
            <CheckBox id={'offer'} label={'Offer'} onChange={handleChange} checked={data.offer}/>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <CheckBox id={'parking'} label={'Parking'} onChange={handleChange} checked={data.parking}/>
            <CheckBox id={'furnished'} label={'Furnished'} onChange={handleChange} checked={data.furnsihed}/>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order" className="border rounded-lg p-3" onChange={handleChange} defaultValue={'created_at_desc'}>
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <Button text={'Search'}/>
       </form>
    </div>
  )
}

export default Form

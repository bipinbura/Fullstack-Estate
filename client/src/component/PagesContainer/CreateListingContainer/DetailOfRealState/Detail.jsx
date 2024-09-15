import InputBox from "../../../UI/InputBox/InputBox"
import CheckBox from "../../../UI/CheckBox/CheckBox"
import TextArea from "../../../UI/TextArea/TextArea"
import NumberBox from "../../../UI/NumberInput/NumberBox"


function Detail({
  onInput=()=>{},
  formData={}
}) {
   

 const RentTrue = formData.type === 'rent'


  function handleChange(e) {
    const { id, type, value, checked } = e.target;

    let updatedData = { ...formData }

    if (id === 'sale' || id === 'rent') {
      updatedData.type = id;
    } else if (type === 'checkbox') {
      updatedData[id] = checked;
    } else if (type === 'number' || type === 'text' || type === 'textarea') {
      updatedData[id] = value;
    }
    onInput(updatedData)
  }


  return (
    <div className="flex flex-col gap-4 flex-1">
    <InputBox placeholder={'Name'} id={'name'} required={true} onChange={handleChange} value={formData.name}/>
    <TextArea placeholder={'Description'} id={'description'} required={true} onChange={handleChange} value={formData.description}/>
    <InputBox placeholder={'Address'} id={'address'} required={true} onChange={handleChange} value={formData.address}/>
        <div className='flex gap-6 flex-wrap'>
            <CheckBox id={'sale'} label={'Sell'} onChange={handleChange} checked={formData.type === 'sale'}/>
            <CheckBox id={'rent'} label={'Rent'} onChange={handleChange} checked={formData.type === 'rent'}/>
            <CheckBox id={'parking'} label={'Parking Spot'} onChange={handleChange} checked={formData.parking}/>
            <CheckBox id={'furnished'} label={'Furnished'} onChange={handleChange} checked={formData.furnished}/>
            <CheckBox id={'offer'} label={'Offer'} onChange={handleChange} checked={formData.offer}/>
        </div>
        <div className='flex gap-6 flex-wrap'>
             <NumberBox id={'bedrooms'} label={'Beds'} min={1} max={10} value={formData.bedrooms} onChange={handleChange}/>
             <NumberBox id={'bathrooms'} label={'Baths'} min={1} max={10} value={formData.bathrooms} onChange={handleChange}/>
             <NumberBox id={'regularPrice'} label={'Regular price'} min={50} max={100000} value={formData.regularPrice} onChange={handleChange} condition={RentTrue}/>
             {formData.offer &&
                          <NumberBox id={'discountPrice'} label={'Discounted price'} min={20} max={100000} value={formData.discountPrice} onChange={handleChange} condition={RentTrue}/>
             }
        </div>
    </div>
  )
}

export default Detail

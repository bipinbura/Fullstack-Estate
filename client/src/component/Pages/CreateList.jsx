import { useState } from "react"
import MultipleImages from "../PagesContainer/CreateListingContainer/UploadMultipleImage/MultipleImages"
import Detail from "../PagesContainer/CreateListingContainer/DetailOfRealState/Detail"
import Button from "../UI/Button/Button"




function CreateList() {
    const [formData, setFormData] = useState({   
      name: '',
      description: '',
      address: '',
      type: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
      imageUrls:[]
    })
  const[image, setImage] = useState([])

  const extractUrls = (arr) => {
    return arr.flatMap(item => item.data); // Flatten the array of arrays
};

 function onChange (value) {
   setFormData((pre)=> ({...pre, ...value }) )
 }

 function handleImage (value) {
  setImage((pre)=>[...pre, ...value])
 }


  async function UploadImage(files) {
  
     try {
      const uploadPromises = files.map(file => {
        const formDatas = new FormData();
        formDatas.append('imageUrls', file);
        return fetch('/api/list/uploadImage', {
          method: 'POST',
          credentials: 'include',
          body: formDatas,
        }).then(res=>res.json());
      })
       const results = await Promise.all(uploadPromises)
       const flatUrl = extractUrls(results)
       return flatUrl;
     } catch (error) {
           console.log(error)
           return [];
     } 
 }

const handleSubmit= async(e)=>{
  e.preventDefault();

  let uploadImageUrls = []

  if(image.length >1 && image.length <= 10) {
     uploadImageUrls = await UploadImage(image)

  }

  const completeFormData = {
    ...formData,
    imageUrls: uploadImageUrls,
  }

  try {
    const res = await fetch('/api/list/createListing',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(completeFormData),
    })
    const data = await res.json();
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

  return (
        <>
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
              Create a Listing    
             </h1>
             <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <Detail formData={formData} onInput={onChange} />
         <div className="flex flex-col">
            <MultipleImages image={image} onInput={handleImage} />
            <Button text={'Upload'} />
        </div>
             </form> 
        </main>
        </>
  )
}

export default CreateList

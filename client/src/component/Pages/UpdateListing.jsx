import { useEffect, useState } from "react"
import MultipleImages from "../PagesContainer/CreateListingContainer/UploadMultipleImage/MultipleImages"
import Detail from "../PagesContainer/CreateListingContainer/DetailOfRealState/Detail"
import Button from "../UI/Button/Button"
import { useParams } from "react-router-dom"

function UpdateListing() {
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
        imageUrls: []
      })
      const [image, setImage] = useState([])
      const [error, setError] = useState('')
      const params = useParams();


      useEffect(()=>{
        async function fetchListing (){
           const listingId = params.id;
           const res = await fetch(`/api/list/selectedListing/${listingId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            }
           )
            const data = await res.json();
            if(!data){
              return ;
            }
            setFormData(data.data)
            setImage(data.data.imageUrls)
        }

        fetchListing();
      },[])
    
      const extractUrls = (arr) => {
        return arr.flatMap(item => item.data); // Flatten the array of arrays
      };
    
      function onChange(value) {
        setFormData((pre) => ({ ...pre, ...value }))
      }
    
      function handleImage(value) {
        setImage((pre) => [...pre, ...value])
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
            }).then(res => res.json());
          })
          const results = await Promise.all(uploadPromises)
          const flatUrl = extractUrls(results)
          return flatUrl;
        } catch (error) {
          console.log(error)
          return [];
        }
      }
    

      function isFile(item){
        return item instanceof File || item instanceof Blob;
      }

      function filterFiles(files){
        return files.filter(isFile)
      }
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(+formData.regularPrice < +formData.discountPrice){
          return setError("Discount price must be lower than regular Price")
        }
    
        let uploadImageUrls = []
        const validFiles = filterFiles(image)
    
        if (validFiles && validFiles.length > 1 && validFiles.length <= 10) {
          
          uploadImageUrls = await UploadImage(validFiles)
    
        } 
    
        const completeFormData = {
          ...formData,
          imageUrls: uploadImageUrls,
        }
    
        try {
          const res = await fetch(`/api/list/updateListing/${params.id}`, {
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
          Update Listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
          <Detail formData={formData} onInput={onChange} />
          <div className="flex flex-col">
            <MultipleImages image={image}  onInput={handleImage} />
            {error && <p className='text-red-700 text-sm self-start'>{error}</p>}
            <Button text={'Upload'} />
          </div>
        </form>
      </main>
    </>
  )
}

export default UpdateListing

import { useState, useRef, useEffect } from "react";

function ProfileImage({formdata, setFormData, currentUser}) {

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileRef = useRef(null);

    const handleFIleChange = (e)=>{
       const selectedFile = e.target.files[0];
       setFile(selectedFile);
       setFormData((prevData)=> ({...prevData, profileImage: selectedFile}))
       console.log(file)
    }

    useEffect(() => {
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
  
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setPreviewUrl(null); 
      }
    }, [file]);

  return (
    <>
      <input
        type="file"
        onChange={handleFIleChange}
        ref={fileRef}
        hidden
        accept="image/*"
      />
      <img
        src={previewUrl ||  currentUser.data?.profileImage} 
        onClick={() => fileRef.current.click()}
        alt="profile"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
      />
  </>
  )
}

export default ProfileImage

import { useEffect, useState } from "react";
import Button from "../Button/Button";


//later improve this component

function ImagePreview({ fileUrl, onDelete }) {

    const [imageUrl, setImageUrl] = useState("");

   
    useEffect(() => {
      if(fileUrl){
        const url = URL.createObjectURL(fileUrl);
        setImageUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
      }
    }, [fileUrl]);

    return (
      <div className="relative">
        <img
          src={imageUrl}
          alt="Selected preview"
          className="w-20 h-20 object-contain rounded-lg"
        />
        <Button text='&times;' onClick={onDelete}
        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"/>
      </div>
    );
  }
  
  export default ImagePreview;

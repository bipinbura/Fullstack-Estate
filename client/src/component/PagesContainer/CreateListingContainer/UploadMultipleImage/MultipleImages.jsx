
import ImagePreview from "../../../UI/ImagesFrame/Image";
import { useState } from "react"


function MultipleImages({
  image=[],
  onInput = () => {}
}) {
  const MaxFile = 10;

  // const [file, setFile] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  console.log(image)

  function HandleChange(e) {
    const filesArray = Array.from(e.target.files);

    if (image.length + filesArray.length > MaxFile) {
      setErrorMessage(`You can only upload a maximum of 10 files`)
      return;
    }
    setErrorMessage("");
    onInput( filesArray);
  }


  function HandleDelete(fileUrl) {
    const updatedFiles = image.filter((file) => file !== fileUrl);
    onInput({ imageUrls: updatedFiles }); 
  }

  return (
    <div className="flex flex-col flex-1 gap-2">
      <p className="font-semibold">
        Images:
        <span className="font-normal text-gray-700 ml-2">The First Images will be the cover (max 10)</span>
      </p>
      <div className="flex gap-4">
        <input onChange={HandleChange}
          className="p-3 border border-gray-300 rounded w-full"
          type="file"
          id='images'
          accept="image/*"
          multiple
        />
      </div>
      {errorMessage && (
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
      )}

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {image.length > 0 && image.map((files, index) => (
          <ImagePreview
            key={index}
            fileUrl={files}
            onDelete={() => HandleDelete(files)}
          />
        ))}
      </div>
    </div>
  )
}

export default MultipleImages

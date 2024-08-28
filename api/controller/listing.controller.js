import { asyncHandler } from "../utils/asynchandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Listing } from "../models/listing.model.js";
import { uploadMultipleImages } from "../utils/cloudinary.utils.js";

const createListing = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    furnished,
    parking,
    type,
    offer,
    bedrooms,
    bathrooms,
    imageUrls,
  } = req.body;


  const Field = !name || !description || !address || !type;
  if (Field) {
    throw new ApiError(401, "Please provide all required fields.");
  }

  if (discountPrice && discountPrice >= regularPrice) {
    throw new ApiError(400, "Discount price must be less than regular price.");
  }

  const newListing = new Listing({
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    furnished,
    parking,
    type,
    offer,
    bedrooms,
    bathrooms,
    imageUrls, // Assign the array of Cloudinary URLs
    userRef: req.user ? req.user.id : null,
  });

  const savedListing = await newListing.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedListing,
        "Profile Image is updated successfully"
      )
    );
});

const uploadImages = asyncHandler(async (req, res) => {
   
  const localFilePath = req.files;

    if(!localFilePath){
        throw new ApiError(400, "Image file is missing");
    }

    const imageUrls = [];

    try {
        const filePAth = localFilePath.map(file => file.path);
        const uploadImages = await uploadMultipleImages(filePAth);
          
        console.log(uploadImages)//
        
        uploadImages.forEach(image=>{
            if(image && image.url){
                imageUrls.push(image.url)
            } else {
                throw new ApiError(400, 'Error while uploading one of the images')
            }
        })

        console.log(imageUrls)
    } catch (error) {
        throw new ApiError(500, "Error occurs during imaeg upload")
    }

return res
.status(200)
.json(new ApiResponse(200, imageUrls, 'Images is successfuly saved'))

})


export { createListing, uploadImages };

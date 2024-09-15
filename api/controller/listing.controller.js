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

  if (!localFilePath) {
    throw new ApiError(400, "Image file is missing");
  }

  const imageUrls = [];

  try {
    const filePAth = localFilePath.map((file) => file.path);
    const uploadImages = await uploadMultipleImages(filePAth);

    uploadImages.forEach((image) => {
      if (image && image.url) {
        imageUrls.push(image.url);
      } else {
        throw new ApiError(400, "Error while uploading one of the images");
      }
    });
  } catch (error) {
    throw new ApiError(500, "Error occurs during imaeg upload");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, imageUrls, "Images is successfuly saved"));
});

const getUserListing = asyncHandler(async (req, res) => {
  const User = req.user?._id;
  if (!User) {
    throw new ApiError(400, "User does not Exit");
  }

  const listing = await Listing.find({ userRef: User });

  return res.status(200).json(new ApiResponse(200, listing, "Listing Found"));
});

const deleteListing = asyncHandler(async (req, res) => {
  const Listid = req.body._id;

  if (!Listid) {
    throw new ApiError(400, "List id ID not provided");
  }

  const user = await Listing.findByIdAndDelete(Listid);

  if (!user) {
    throw new ApiError(404, "User not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "List deleted successfully"));
});

const updateListing= asyncHandler(async(req,res)=>{
  const {id} = req.params

  if (!id) {
    throw new ApiError(400, "List id ID not provided");
  }
  const existingList = await Listing.findById(id);

  const newImages = req.body.imageUrls || [];
  const ExistingImage = existingList.imageUrls || [];

  const combineImages= [...ExistingImage, ...newImages];

   const updatedList = await Listing.findByIdAndUpdate(id,
    {...req.body, imageUrls:combineImages},
    {new:true}
 )

      return res
      .status(200)
      .json(updatedList)
})

const getChoseListing = asyncHandler(async(req, res)=>{
  const {id} = req.params;
  if(!id){
    throw new ApiError('List is not found')
  }
   
  const list = await Listing.findById(id);

  if(!list){
    throw new ApiError('Selected information is not available')
  }

  return res
  .status(200)
  .json(new ApiResponse(200,list,'List is found'))
 
})

const searchListings = asyncHandler(async(req,res)=>{

 /* const limit = parseInt(req.query.limit) || 9 ;
  const startIndex = parseInt(req.query.startIndex) || 0;

  let offer = req.query.offer;
  if(offer === 'undefined' || offer === false){
     offer = {$in:[false, true]};
  }

  let furnished = req.query.furnished;
  if(furnished === 'undefined' || furnished === false){
    furnished = {$in:[false, true]}
  }
 
  let parking = req.query.parking;
  if(parking === 'undefined' || parking === false){
    parking = {$in:[false, true]}
  }

  let type = req.query.type;
  if(type === 'undefined' || type === 'all'){
    type={$in:['sale', 'rent']}
  }

  const searchTerm = req.query.searchTerm || '';
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'desc';



  const listing = await Listing.find({
    name:{$regex:searchTerm, $options: 'i'},
    offer,
    furnished,
    parking,
    type, 
  }).sort({[sort]: order}).limit(limit).skip(startIndex)

  return res
  .status(200)
  .json(listing)*/

  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;


  let offer;
  if (req.query.offer === 'false') {
    offer = false;
  } else if (req.query.offer === 'true') {
    offer = true;
  } else {
    offer = { $in: [false, true] }; 
  }

  // Handle 'furnished' field
  let furnished;
  if (req.query.furnished === 'false') {
    furnished = false;
  } else if (req.query.furnished === 'true') {
    furnished = true;
  } else {
    furnished = { $in: [false, true] }; 
  }


  let parking;
  if (req.query.parking === 'false') {
    parking = false;
  } else if (req.query.parking === 'true') {
    parking = true;
  } else {
    parking = { $in: [false, true] };
  }

  let typeFilter = {};
  if (req.query.type && req.query.type !== 'all') {
    typeFilter = { type: req.query.type }; 
  } else {
    typeFilter = { type: { $in: ['sale', 'rent'] } };  
  }


  const searchTerm = req.query.searchTerm && req.query.searchTerm.trim() !== ''
    ? { name: { $regex: `.*${req.query.searchTerm}.*`, $options: 'i' } }
    : {};


  const sort = req.query.sort || 'createdAt'; 
  const order = req.query.order || 'desc';  


  const listings = await Listing.find({
    ...searchTerm,  
    offer,
    furnished,
    parking,
    ...typeFilter
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return res.status(200).json(listings);
})

export { createListing, 
  uploadImages,
   getUserListing,
    deleteListing,
    updateListing,
    getChoseListing,
    searchListings
  };

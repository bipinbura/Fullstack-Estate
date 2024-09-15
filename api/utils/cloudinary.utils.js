import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


// Configuration
cloudinary.config({ 
    cloud_name:'', 
    api_key:'',
    api_secret:''
});

const uploadOnCloudinary = async(localFilePath)=>{
    
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })

        console.log('File has been successfully on cloudinary', response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
      await  fs.promises.unlink(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;                              
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image from Cloudinary with public ID: ${publicId}`);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error.message);
        throw error;
    }
};


const uploadMultipleImages = async (localFilePaths) => {
    if (!Array.isArray(localFilePaths) || localFilePaths.length === 0) {
        return [];
    }

    try {
        // Use map to initiate uploads for all files
        const uploadPromises = localFilePaths.map((filePath) => uploadOnCloudinary(filePath));

        // Wait for all uploads to complete
        const uploadResponses = await Promise.all(uploadPromises);

        // Filter out any null responses (failed uploads) and return only the successful uploads
        const successfulUploads = uploadResponses.filter(response => response !== null);

              console.log('successfulUploads', successfulUploads)

        return successfulUploads; // Array of responses from Cloudinary
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        return [];
    }
};


export {uploadOnCloudinary, deleteFromCloudinary, uploadMultipleImages}


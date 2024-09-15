import {Router} from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.middleware.js'
import { createListing ,
    uploadImages,
     getUserListing,
     deleteListing,
     updateListing,
     getChoseListing,
     searchListings
    } from '../controller/listing.controller.js';
const router = Router();



router.route('/createListing').post(verifyJWT ,createListing)
router.route('/uploadImage').post(verifyJWT, upload.array("imageUrls", 10),uploadImages)
router.route('/deleteListing').patch(verifyJWT ,deleteListing)
router.route('/getListing').post(verifyJWT, getUserListing)
router.route('/updateListing/:id').post(verifyJWT,updateListing)
router.route('/selectedListing/:id').get(verifyJWT,getChoseListing)
router.route('/searchListing').get(searchListings)
export default router
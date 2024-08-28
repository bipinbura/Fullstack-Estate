import {Router} from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.middleware.js'
import { createListing ,uploadImages} from '../controller/listing.controller.js';
const router = Router();
router.use(verifyJWT)


router.route('/createListing').post(createListing)
router.route('/uploadImage').post( upload.array("imageUrls", 10),uploadImages)

export default router
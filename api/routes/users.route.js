import {Router} from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js'
import {upload} from '../middleware/multer.middleware.js'
import {
  test,
  signUp,
  signIn,
  logout,
  updateUserDetail,
  changePassword,
  deleteUser,
  updateUserProfileImage,
} from "../controller/user.contoller.js";
const router = Router();

router.route('/'). get(test);
router.route('/signup').post(signUp)
router.route('/signin').post(signIn)
router.route('/signout').post(verifyJWT, logout) //secure route
router.route('/updateuserProfile').put(verifyJWT,updateUserDetail)
router.route('/changePassword').post(verifyJWT, changePassword)
router.route('/delete').delete(verifyJWT, deleteUser)
router.route('/updateProfileImage').post(verifyJWT, upload.single("profileImage"), updateUserProfileImage)


export default router
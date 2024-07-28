import {Router} from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js'
import {test, signUp, signIn , logout} from "../controller/user.contoller.js"
const router = Router();

router.route('/'). get(test);
router.route('/signup').post(signUp)
router.route('/signin').post(signIn)
router.route('/logout').post(verifyJWT, logout) //secure route

export default router
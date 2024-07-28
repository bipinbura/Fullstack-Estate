import {Router} from 'express';
import {test, signUp} from "../controller/user.contoller.js"
const router = Router();

router.route('/'). get(test);
router.route('/signup').post(signUp)

export default router
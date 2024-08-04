import {Router} from 'express';

const router = Router();

import {googleAuth} from '../controller/googleauth.controller.js'

router.route('/google').post(googleAuth)

export default router

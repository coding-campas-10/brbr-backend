import express from 'express';
const router = express.Router();

import authRoute from './auth-old.js';
import otpCodeRoute from './barcode-otp.js';


router.use('/otp', otpCodeRoute);
router.use('/auth', authRoute);

export default router;
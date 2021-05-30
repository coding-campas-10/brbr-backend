import express from 'express';
const router = express.Router();

import authRoute from './auth-old.js';
import otpCodeRoute from './barcode-otp.js';
import stationRoute from './station.js';


router.use('/otp', otpCodeRoute);
router.use('/auth', authRoute);
router.use('/stations', stationRoute);

export default router;
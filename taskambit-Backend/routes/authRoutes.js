const express = require('express')
const authRoute = express.Router();

const authController = require('../controller/authController');
const verifyToken = require('../middleware/authMiddleware');

authRoute.post('/sign-up', authController.signup);

authRoute.post('/sign-in', authController.signinByEmail);

authRoute.post('/update-password',verifyToken, authController.updatePassword);

authRoute.post('/reset-password-email',verifyToken, authController.resetPasswordEmail);

authRoute.post('/reset-password', authController.resetPassword);

module.exports = authRoute;
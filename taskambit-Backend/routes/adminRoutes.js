const express = require('express')
const adminRoutes = express.Router();
const adminController = require('../controller/adminController')
const verifyToken = require('../middleware/authMiddleware');

adminRoutes.post('/get-any-profile-image', verifyToken, adminController.getAnyProfileImage);

adminRoutes.post('/get-all-user-details', verifyToken, adminController.getAllUserDetails);

module.exports = adminRoutes;
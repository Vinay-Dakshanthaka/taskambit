const express = require('express')
const userRoutes = express.Router();
const userControler = require('../controller/userController')
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const imageStorage = multer({dest : 'profileImages/'})
const storage = multer.memoryStorage();
const upload = multer({storage : storage})

userRoutes.post('/update-profile-image',imageStorage.single('file'), verifyToken, userControler.saveProfileImage);

userRoutes.get('/get-profile-image', verifyToken, userControler.getProfileImage);

module.exports = userRoutes;
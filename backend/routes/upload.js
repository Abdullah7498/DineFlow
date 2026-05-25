const express = require('express');

const { upload } = require('../config/cloudinary');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = router;

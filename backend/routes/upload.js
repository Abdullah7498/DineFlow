const express = require('express');

const { upload } = require('../config/s3');
const uploadController = require('../controllers/uploadController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  restrictTo('owner', 'manager'),
  upload.single('image'),
  uploadController.uploadImage
);
router.post(
  '/presigned-url',
  restrictTo('owner', 'manager'),
  uploadController.createPresignedUploadUrl
);

module.exports = router;

const uploadService = require('../services/uploadService');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Please upload an image file');
      error.statusCode = 400;
      throw error;
    }

    const upload = await uploadService.uploadImage(req.file, {
      tenantDb: req.tenantDb,
      folder: req.body.folder,
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: upload,
    });
  } catch (error) {
    next(error);
  }
};

const createPresignedUploadUrl = async (req, res, next) => {
  try {
    const upload = await uploadService.createPresignedUploadUrl({
      ...req.body,
      tenantDb: req.tenantDb,
    });

    res.status(200).json({
      success: true,
      message: 'Presigned upload URL generated successfully',
      data: upload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  createPresignedUploadUrl,
};

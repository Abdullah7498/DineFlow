const uploadService = require('../services/uploadService');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Please upload an image file');
      error.statusCode = 400;
      throw error;
    }

    const upload = await uploadService.queueUploadAlert(req.file);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully & background notification queued!',
      data: upload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};

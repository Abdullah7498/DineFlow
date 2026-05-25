const { emailQueue } = require('../queues/emailQueue');

const queueUploadAlert = async (file) => {
  const job = await emailQueue.add('upload-alert', {
    to: 'admin@saas-restaurant.com',
    subject: 'New Image Asset Uploaded',
    body: `A new image has been successfully uploaded. URL: ${file.path}`,
  });

  return {
    imageUrl: file.path,
    publicId: file.filename,
    mimetype: file.mimetype,
    jobId: job.id,
  };
};

module.exports = {
  queueUploadAlert,
};

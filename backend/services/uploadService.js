const crypto = require('crypto');
const path = require('path');
const { DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const env = require('../config/env');
const { s3Client } = require('../config/s3');
const { getEmailQueue } = require('../queues/emailQueue');

const assertS3Configured = () => {
  if (!env.AWS_S3_BUCKET) {
    const error = new Error('AWS_S3_BUCKET is required for S3 uploads');
    error.statusCode = 500;
    throw error;
  }
};

const sanitizeFolder = (folder = 'uploads') => {
  return folder
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '') || 'uploads';
};

const buildPublicUrl = (key) => {
  if (env.AWS_CLOUDFRONT_URL) {
    return `${env.AWS_CLOUDFRONT_URL.replace(/\/$/, '')}/${key}`;
  }

  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
};

const buildObjectKey = ({ originalname, folder, tenantDb }) => {
  const extension = path.extname(originalname || '').toLowerCase() || '.jpg';
  const safeFolder = sanitizeFolder(folder);
  const tenantSegment = tenantDb ? sanitizeFolder(tenantDb) : 'public';
  const id = crypto.randomUUID();

  return `${tenantSegment}/${safeFolder}/${id}${extension}`;
};

const queueUploadAlert = async (fileUrl) => {
  const job = await getEmailQueue().add('upload-alert', {
    to: 'admin@saas-restaurant.com',
    subject: 'New Image Asset Uploaded',
    body: `A new image has been successfully uploaded. URL: ${fileUrl}`,
  });

  return job.id;
};

const uploadImage = async (file, options = {}) => {
  assertS3Configured();

  const key = buildObjectKey({
    originalname: file.originalname,
    folder: options.folder,
    tenantDb: options.tenantDb,
  });

  await s3Client.send(new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: 'AES256',
  }));

  const imageUrl = buildPublicUrl(key);
  const jobId = await queueUploadAlert(imageUrl);

  return {
    imageUrl,
    key,
    bucket: env.AWS_S3_BUCKET,
    mimetype: file.mimetype,
    size: file.size,
    jobId,
  };
};

const createPresignedUploadUrl = async ({ fileName, contentType, folder, tenantDb }) => {
  assertS3Configured();

  if (!fileName || !contentType || !contentType.startsWith('image/')) {
    const error = new Error('fileName and image contentType are required');
    error.statusCode = 400;
    throw error;
  }

  const key = buildObjectKey({ originalname: fileName, folder, tenantDb });
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: 'AES256',
  });

  return {
    uploadUrl: await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 }),
    method: 'PUT',
    key,
    imageUrl: buildPublicUrl(key),
    expiresInSeconds: 300,
  };
};

const deleteObject = async (key) => {
  assertS3Configured();

  await s3Client.send(new DeleteObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
  }));

  return { key };
};

module.exports = {
  uploadImage,
  queueUploadAlert,
  createPresignedUploadUrl,
  deleteObject,
};

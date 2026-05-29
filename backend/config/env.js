const { cleanEnv, str, port } = require('envalid');
const dotenv = require('dotenv');

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
  PORT: port({ default: 5000 }),
  MONGO_URI: str({ default: 'mongodb://localhost:27017/saas-restaurant' }),
  REDIS_HOST: str({ default: '127.0.0.1' }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASSWORD: str({ default: '', allowEmpty: true }),
  CLOUDINARY_CLOUD_NAME: str({ default: 'placeholder' }),
  CLOUDINARY_API_KEY: str({ default: 'placeholder' }),
  CLOUDINARY_API_SECRET: str({ default: 'placeholder' }),
  AWS_REGION: str({ default: 'us-east-1' }),
  AWS_ACCESS_KEY_ID: str({ default: '', allowEmpty: true }),
  AWS_SECRET_ACCESS_KEY: str({ default: '', allowEmpty: true }),
  AWS_S3_BUCKET: str({ default: '', allowEmpty: true }),
  AWS_CLOUDFRONT_URL: str({ default: '', allowEmpty: true }),
  JWT_SECRET: str({ default: 'supersecretkey' }),
});

module.exports = env;

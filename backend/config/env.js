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
  JWT_SECRET: str({ default: 'supersecretkey' }),
});

module.exports = env;

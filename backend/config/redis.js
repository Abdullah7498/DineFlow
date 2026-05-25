const Redis = require('ioredis');
const env = require('./env');

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
};

if (env.REDIS_PASSWORD) {
  redisOptions.password = env.REDIS_PASSWORD;
}

const redis = new Redis(redisOptions);

redis.on('connect', () => {
  console.log('⚡ Redis Connected Successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});

module.exports = redis;

const { Queue, Worker } = require('bullmq');
const env = require('../config/env');

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
};

const emailQueue = new Queue('emailQueue', { connection });

let emailWorker;

const createEmailWorker = () => {
  if (emailWorker) {
    return emailWorker;
  }

  emailWorker = new Worker(
    'emailQueue',
    async (job) => {
      console.log(`📥 Processing background job ${job.id} for: ${job.name}`);
      const { to, subject } = job.data;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`✅ Email sent successfully to ${to} with subject "${subject}"`);
      return { success: true, to, subject };
    },
    { connection }
  );

  emailWorker.on('completed', (job) => {
    console.log(`🎉 Background Job ${job.id} completed successfully.`);
  });

  emailWorker.on('failed', (job, err) => {
    console.error(`❌ Background Job ${job.id || 'unknown'} failed with error: ${err.message}`);
  });

  return emailWorker;
};

module.exports = {
  emailQueue,
  createEmailWorker,
};

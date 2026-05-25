const env = require('../config/env');

const notFoundHandler = (req, res, next) => {
  res.status(404);
  const error = new Error(`🔍 Route not found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode);

  res.json({
    success: false,
    message: err.message,
    stack: env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

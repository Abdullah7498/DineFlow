const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const env = require('./config/env');
const connectDB = require('./config/db');
const initSockets = require('./sockets/socketHandler');
const { createEmailWorker } = require('./queues/emailQueue');

const apiLimiter = require('./middlewares/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middlewares/error');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');

connectDB();
createEmailWorker();

const app = express();
const server = http.createServer(app);

const io = initSockets(server);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use('/api/', apiLimiter);

if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

app.use(mongoSanitize());
app.use(xss());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the SaaS Restaurant API Portal!',
        version: '1.0.0',
        environment: env.NODE_ENV,
    });
});

app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.PORT;
server.listen(PORT, () => {
    console.log(`🚀 Server successfully booted on http://localhost:${PORT}`);
    console.log(`🌍 Active environment: ${env.NODE_ENV}`);
});

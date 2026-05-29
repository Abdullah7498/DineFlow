const http = require('http')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const env = require('./config/env')
const connectDB = require('./config/db')
const initSockets = require('./sockets/socketHandler')
const { createEmailWorker } = require('./queues/emailQueue')

const apiLimiter = require('./middlewares/rateLimiter')
const mongoSanitize = require('./middlewares/sanitize')
const { notFoundHandler, errorHandler } = require('./middlewares/error')
const uploadRouter = require('./routes/upload')
const authRouter = require('./routes/auth')
const restaurantRouter = require('./routes/restaurant')
const menuRouter = require('./routes/menu')
const ordersRouter = require('./routes/orders')
const posRouter = require('./routes/pos')
const inventoryRouter = require('./routes/inventory')
const analyticsRouter = require('./routes/analytics')
const loyaltyRouter = require('./routes/loyalty')

connectDB()
createEmailWorker()

const app = express()
const server = http.createServer(app)

const io = initSockets(server)

app.use((req, res, next) => {
  req.io = io
  next()
})

app.use(helmet())
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)

// app.use('/api/', apiLimiter)

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())
app.use(compression())

app.use(mongoSanitize)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the SaaS Restaurant API Portal!',
    version: '1.0.0',
    environment: env.NODE_ENV
  })
})

app.use('/api/upload', uploadRouter)
app.use('/api/auth', authRouter)
app.use('/api/restaurant', restaurantRouter)
app.use('/api/menu', menuRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/pos', posRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/loyalty', loyaltyRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = env.PORT
server.listen(PORT, () => {
  console.log(`🚀 Server successfully booted on http://localhost:${PORT}`)
  console.log(`🌍 Active environment: ${env.NODE_ENV}`)
})

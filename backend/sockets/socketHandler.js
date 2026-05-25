const { Server } = require('socket.io');

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  console.log('🔌 Socket.io initialized successfully');

  io.on('connection', (socket) => {
    console.log(`👤 Client connected: ${socket.id}`);

    socket.on('join_restaurant', (restaurantId) => {
      socket.join(restaurantId);
      console.log(`🏢 Socket ${socket.id} joined restaurant room: ${restaurantId}`);
    });

    socket.on('new_order', (orderData) => {
      const { restaurantId } = orderData;
      console.log(`📦 New order received for restaurant room: ${restaurantId}`);
      io.to(restaurantId).emit('order_update', orderData);
    });

    socket.on('disconnect', () => {
      console.log(`👤 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSockets;

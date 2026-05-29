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

    socket.on('join_branch', (branchId) => {
      socket.join(`branch:${branchId}`);
      console.log(`🏢 Socket ${socket.id} joined branch room: ${branchId}`);
    });

    socket.on('new_order', (orderData) => {
      const { branchId } = orderData;
      console.log(`📦 New order received for branch room: ${branchId}`);
      io.to(`branch:${branchId}`).emit('order_update', orderData);
    });

    socket.on('disconnect', () => {
      console.log(`👤 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSockets;

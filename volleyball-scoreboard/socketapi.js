const io = require("socket.io")();
const socketapi = {
    io: io
}

io.on('connection', (socket) => {
    console.log('User connected');
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  module.exports = socketapi;
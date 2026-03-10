import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('client connected:', socket.id);

  // JOIN ROOM
  socket.on('join-room', async (roomId) => {
    socket.join(roomId);

    const socketsInRoom = await io.in(roomId).allSockets();

    const existingUsers = Array.from(socketsInRoom).filter((id) => id !== socket.id);

    socket.emit('all-users', existingUsers);

    socket.to(roomId).emit('user-joined', socket.id);
  });

  // OFFER
  socket.on('offer', ({ target, sdp }) => {
    io.to(target).emit('offer', {
      from: socket.id,
      sdp
    });
  });

  // ANSWER
  socket.on('answer', ({ target, sdp }) => {
    io.to(target).emit('answer', {
      from: socket.id,
      sdp
    });
  });

  // ICE
  socket.on('ice-candidate', ({ target, candidate }) => {
    io.to(target).emit('ice-candidate', {
      from: socket.id,
      candidate
    });
  });

  // CHAT
  socket.on('chat-message', ({ roomId, message, name }) => {
    socket.to(roomId).emit('chat-message', {
      from: socket.id,
      message,
      name
    });
  });

  // CODE EDITOR SYNC
  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-change', {
      code
    });
  });

  // USER LEAVE
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('user-left', socket.id);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Signal server running on port ${PORT}`);
});

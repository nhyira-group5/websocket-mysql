const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const service = require('./service/messageService');

const PORT = 3001;

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/messages', require('./routes'));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

let userConnected = [];

io.on('connection', socket => {
  const chats = socket.handshake.auth.chats;
  const user = socket.handshake.auth.user;
  console.log(socket.handshake.auth);

  userConnected.push(user);

  chats.forEach(chat => {
    socket.join(chat.id);

    socket.on('ttm', async m => {
        console.log(m);

      const message = {
        chatId: m.chatId,
        remetenteId: m.remetenteId,
        destinatarioId: m.destinatarioId,
        assunto: m.assunto,
        dataHora: new Date()
      };

      try {
        await service.registerMessage(message);
        io.to(chat.id).emit('ttm', { ...message });
      } catch (e) {
        return socket.emit('messageError', e.message);
      }
    });

    socket.on('typing', data => {
      io.to(chat.id).emit('typing', data.username);
    });
  });

  socket.on('disconnect', () => {
    chats.forEach(chat => {
      io.to(chat.id).emit('userDisconnected', user.username);
    });

    // Remove user from connected users list
    userConnected = userConnected.filter(u => u !== user);

    // Emit updated user list
    io.emit('userConnected', userConnected);
  });
});

server.listen(PORT, () => {
  console.log(`Running at port ${PORT}`);
});
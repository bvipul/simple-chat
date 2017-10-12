const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const log = require('beautiful-logs')();

const app = express();
const server = http.Server(app);
const io = socketIO(server);

log.info('simple-chat is starting...');

// Exposes the folder frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

io.on('connection', function(socket) {

  log.debug('EVENT: connection, MSG: new connection has been established');

  // Prompt user for username clientside
  // Welcome user in chat with name
  socket.on('name', name => {

    log.debug(`EVENT: name, MSG: Triggered by - ${name}`);

    // Save the username and join timestamp
    socket.meta = {
      username: name,
      joinedAt: Date.now()
    };

    // Emit a join event
    io.emit('join', {
      user: socket.meta.username,
      time: socket.meta.joinedAt
    });

    //New message
    socket.on('msg', msg => {

      log.debug(`EVENT: msg, MSG: Triggered by - ${socket.meta.username} MSG - ${msg}`);

      const timestamp = Date.now();
      // Send the message to all users
      io.emit('msg', {
        user: socket.meta.username,
        msg: msg,
        time: timestamp
      });
    });

    // Handle disconnect
    socket.on('disconnect', reason => {

      log.debug(`EVENT: disconnect, MSG: Triggered by - ${socket.meta.username} MSG - User has been disconnected from the live connection`);

      const timestamp = Date.now();
      // Emit a leave event
      io.emit('leave', {
        user: socket.meta.username,
        time: timestamp,
        duration: timestamp - socket.meta.joinedAt
      });
    });
  });
});

server.on('error', error => {
  log.err(`Error while starting the server`, error);
});

server.listen(process.env.PORT || 80, () => {
  log.info(`Server is listening on port: ${server.address().port}`);
});

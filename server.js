// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const http = require('http');
const server = http.createServer(app);

// socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://fierce-mesa-54468.herokuapp.com',
  },
});

io.on('connection', (socket) => {
  const room = socket.handshake.query.roomName;
  socket.join(room);

  socket.on('send-message', ({ sender, text, avatar }) => {
    socket.broadcast.to(room).emit('receive-message', { sender, text, avatar });
  });
});

// Environmental variables
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const db = mongoose.connection;
mongoose.connect(MONGODB_URI);
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

/////////////////
// CONTROLLERS
const usersController = require('./controllers/usersController');
app.use('/users', usersController);
/////////////////

// Routes
app.get('/', (req, res) => {
  res.send('exquisite corpse');
});

// Listener
server.listen(PORT, () => console.log('Listening on port: ', PORT));

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const index = require('./routes/index');

const app = express();

app.use(index);
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

let users = 0;
let userList = [];
let messages = [];

io.on('connection', (socket) => {
    users++;
    socket.emit('msgList', messages );
    socket.on('newMessage', (msg) => {
        messages.push(msg);
        socket.emit('msgList', messages);
        io.sockets.emit('msgList', messages);
    });

    socket.on('newUser', username => {
        userList.push(username);
        io.sockets.emit('userList', userList );
        console.log(userList);
    })
});


server.listen(PORT, () => { console.log(`Server start at : ${PORT}`)});
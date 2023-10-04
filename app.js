const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT , ()=> {
    console.log(`app is running on port ${PORT}`);
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

io.on('connection' , onConnect);

function onConnect(socket) {
    socketsConnected.add(socket.id);

    io.emit('clients-total' , socketsConnected.size);
    
    socket.on('disconnect' , () =>{
        console.log('socket disconnect : ',socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total' , socketsConnected.size);
    });

    socket.on('message' , (data) => {
        socket.broadcast.emit('chat-message' , data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    });

}


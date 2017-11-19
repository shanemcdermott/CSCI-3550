var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var clients = [];

io.on ('connection', function(socket){
    clients.push(socket.id);
    var clientConnectedMsg = 'User connected ' + util.inspect(socket.id) + ', total: ' + clients.length;
    console.log(clientConnectedMsg);

    socket.on('disconnect', function(){
        clients.pop(socket.id);
        var clientDisconnectedMsg = 'User disconnected ' + util.inspect(socket.id) + ', total: ' + clients.length;
        console.log(clientDisconnectedMsg);
    })
});

http.listen(8080, function(){
    console.log('listening on *:8080');
});

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function sendWind()
{
    console.log('Wind sent to user');
    io.emit('new wind', getRandomInRange(0,360));
}

setInterval(sendWind, 3000);
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

http.listen(process.env.PORT, process.env.IP, 1000000, function(){
    console.log("connected");
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//TODO- Ask about improving this!
app.get('/city.png', function(req,res){
   res.sendFile(__dirname + '/city.png'); 
});

var waitingForGame = [];
var games = [];
var sessions = [];



//currently just shares the keypress with the other player
io.on('connection', function(socket)
{

//look into debouncing

    socket.on('client_keypress', function(msg){
        if(msg.gameId>=games.length){return;}
        socket.broadcast.emit("server_keypress", msg);
    });

    
    socket.on('requestGame', function(msg){
        
        console.log(msg);

        waitingForGame.push(socket);

        if(waitingForGame.length >= 2)
        {
            var socket1 = waitingForGame.pop();
            var socket2 = waitingForGame.pop();
            launchGame([socket1,socket2]);
            
        }

    });
});

function launchGame(sockets)
{
    var gameId = games.length;
    var gameInstance = new game(gameId, []);
    var session = new gameSession(gameId, sockets);

    for(let i = 0; i < sockets.length; i++)
    {
        let name = "player"+i;
        gameInstance.objects.push(new component(i,name,32,32,"blue",10,i*10,"block"));
        gameInstance.players.push(new controller(i,i));
    }
 
    games.push(gameInstance);
    sessions.push(session);
    
    for(let i = 0; i < sockets.length; i++)
    {
        sockets[i].emit("Start Game", {
            "game" : gameInstance,
            "playerAssignment" : i,
        });
    }
}


//Object Types

function gameSession(id, sockets)
{
    this.id = id;
    this.sockets = sockets;
}


function game(id, objects)
{
    this.id = id;
    this.players = [];
    this.objects = objects;
    this.state = "playing";
}


function component(id, name, width, height, src, x, y, type) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.src = src;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
}

function controller(id, pawn_id)
{
    this.id = id;
    this.pawn_id = pawn_id;
    this.keys = [];
}
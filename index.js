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

function gameInstance(id, socket1, socket2, objects)
{
    this.id = id;
    this.sockets = [socket1, socket2];
    this.objects = objects;
    this.state = "playing";
    this.players = [];
          
    this.addObject = function(gameObject) {
        let obj_id = this.objects.length;
        this.objects.push(gameObject);
        return obj_id;
    }
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
    
    this.setSpeed = function(x, y) {
        this.speedX = x;
        this.speedY = y;
    }
    
    this.update = function() {
      this.updatePos();
    }
    
    this.updatePos = function()
    {
        this.x += this.speedX;
        this.y += this.speedY;          
    }
}

function controller(pawn_id, team)
{
    this.pawn_id = pawn_id;
    this.team = team;
    this.keys = [];
    
    /*
    this.updatePawn = function()
    {
        let dirX = 0;
        let dirY = 0;
        if(this.keys)
        {
            if(this.keys[37]){dirX = -1;}
            if(this.keys[39]){dirX = 1;}
            if(this.keys[38]){dirY = -1;}
            if(this.keys[40]){dirY = 1;}
        }
        game.objects[this.pawn_id].setSpeed(dirX,dirY);
    }
    */
}

//currently just shares the keypress with the other player
io.on('connection', function(socket){

    socket.on('client_keypress', function(msg){
        if(msg.gameId>=games.length){return;}
        var game = games[msg.gameId];
        console.log(msg);
        for(let i = 0; i < game.sockets.length; i++)
        {
            if(game.sockets[i]!= socket)
            {
                
              game.sockets[i].emit("server_keypress", msg);
            }
        }
        
    });

    
    socket.on('requestGame', function(msg){
        
        console.log(msg);

        waitingForGame.push(socket);

        if(waitingForGame.length >= 2)
        {
            var socket1 = waitingForGame.pop();
            var socket2 = waitingForGame.pop();
            //var socket1 = waitingForGame[0];
            //waitingForGame.splice(0, 1);
            //var socket2 = waitingForGame[0];
            //waitingForGame.splice(0, 1);
            
            var game = new gameInstance(games.length, socket1, socket2, []);

            game.objects.push(new component(0, "player1", 32,32, "city.png", 10,0,"image"));
            game.objects.push(new component(1, "player2", 32,32, "blue", 10,0,"block"));
            game.players.push(new controller(0, 0));
            game.players.push(new controller(1, 1));

            games.push(game);
            
            
            socket1.emit("Start Game", {
                "id" : game.id,
                "playerAssignment" : 0,
                "players": game.players,
                "objects": game.objects,
            });

            socket2.emit("Start Game", {
                "id" : game.id,
                "playerAssignment" : 1,
                "players": game.players,
                "objects": game.objects,
            });
        }

    });
});


console.log("Still marketing to do.")

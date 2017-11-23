var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
//const pointsInPolygon = require('points-in-polygon');
//const mapGen = require('./lib/mapgen2/mapgen');
var port = process.env.PORT || 3000;
var ip = process.env.IP;

http.listen(port, ip, 1000000, function(){
    console.log("connected");
});

app.use(express.static('public/'));

var waitingForGame = [];
var games = [];

function gameInstance(id, socket1, socket2, objects)
{
    this.id = id;
    this.players = [socket1, socket2];
    this.objects = objects;
}

function vec2(x, y)
{
    this.x = x;
    this.y = y;
    this.add = function(v2)
    {
        this.x += v2.x;
        this.y += v2.y;
    }
    this.sub = function(v2)
    {
        this.x -= v2.x;
        this.y -= v2.y;
    }
}

function gameObject(id, width, height, x, y) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.loc = new vec2(x,y);
    this.vel = new vec2(0,0);
}

function makeMap()
{
    /*
    var map = mapGen.calculate(null);
    
    let polygons = [];
    for(let r = 0; r < map.mesh.numSolidRegions; r++){
        polygons.push({biome: map.r_biome[r],
        vertices: map.mesh.r_circulate_t([], r)
                        .map((t) => map.t_vertex[t])
        });
    }
    pointsInPolygon(polygon, (x,y) => console.log(x,y));
    */
}

io.on('connection', function(socket){

    socket.on('move', function(msg){
        
        if(msg.gameId>=games.length){return;}

        var game = games[msg.gameId];
        console.log(msg);

        for(let i = 0; i < msg.objects.length; i++)
        {
            game.objects[msg.objects[i].id].loc = msg.objects[i].loc;
        }
        for(let i = 0; i < game.players.length; i++)
        {
            game.players[i].emit('move', msg.objects);
        }

        games[msg.gameId] = game;
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
            makeMap();
            game.objects.push(new gameObject(0, 30,30,10,120));
            game.objects.push(new gameObject(1,30,30,60,150));

            games.push(game);

            socket1.emit("Start Game", {
                "id" : game.id,
                "playerAssignment" : 0,
                "objects": game.objects,
            });

            socket2.emit("Start Game", {
                "id" : game.id,
                "playerAssignment" : 1,
                "objects": game.objects,
            });
        }

    });
});


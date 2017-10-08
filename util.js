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

function startGame() {
    gameArea.start();
    let pawn = new component(30,30, "blue", 10, 120);
    gameObjects.push(pawn);
    player = new controller(pawn);
}


var player;
var gameObjects = [];

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1080;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
          gameArea.keys = (gameArea.keys || []);
          gameArea.keys[e.keyCode] = (e.type == "keydown");  
        })
        window.addEventListener('keyup', function(e){
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear : function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}



function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.loc = new vec2(x,y);
    this.vel = new vec2(0,0);

    this.update = function(){
        this.loc.add(this.vel);
    }
    
    this.render = function(ctx){
        ctx.fillStyle = color;
        ctx.fillRect(this.loc.x, this.loc.y, this.width, this.height);
    }

    this.move = function(dir){
        this.vel = dir;
    }
    this.stopMove = function()
    {
        this.vel = new vec2(0,0);
    }
}

function controller(pawn)
{
    this.pawn = pawn;

    this.updatePawn = function()
    {
        let dir = new vec2(0,0);
        if(gameArea.keys)
        {
            if(gameArea.keys[37]){dir.x = -1;}
            if(gameArea.keys[39]){dir.x = 1;}
            if(gameArea.keys[38]){dir.y = -1;}
            if(gameArea.keys[40]){dir.y = 1;}
        }
        this.pawn.move(dir);
    }
}

function updateGameArea() {
    player.updatePawn();
    for(let i = 0; i < gameObjects.length; i++)
    {
        gameObjects[i].update();
    }
    renderGameArea();
}

function renderGameArea() {
    gameArea.clear();
    for(let i = 0; i < gameObjects.length; i++)
    {
        gameObjects[i].render(gameArea.context);
    }
}
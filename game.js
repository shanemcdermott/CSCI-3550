
function gameInstance(id, players)
{
  this.id = id;
  this.players = players;
  this.state = new startState(id,players);
  this.interval = setInterval(updateGame, 20);
}

function gameState(id, objects)
{
    this.id=id;
    this.objects=objects;
    
    this.update = function()
    {
        for(let i = 0; i < this.objects.length; i++)
        {
            this.objects[i].update();
        }
    }
}

function startState(id)
{
    var objects = [
        new gameObject(0,32,32,16,48,"blue","shape"),
        new gameObject(0,32,32,64,64,"red","shape"),
        ];
    
    return new gameState(id,objects);
}

function updateGame()
{
    
}

function gameObject(id, width, height, x, y, color, type)
{
    this.id = id;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.type=type;
    if(type == "image")
    {
        this.image = new Image();
        this.image.src= color;
    }
    else
    {
        this.color=color;
    }
    this.speedX=0;
    this.speedY=0;
    
    this.update = function()
    {
        this.x += speedX;
        this.y += speedY;
    }
    
    this.render = function()
    {
        ctx = gameArea.context;
        if(type == "image")
        {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else
        {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}


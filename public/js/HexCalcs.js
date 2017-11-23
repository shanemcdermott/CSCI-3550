function createHexGrid(sideWidth, sideHeight, canvasWidth,canvasHeight)
{
	var y = sideHeight/2.0;
	
	//solve quadratic
	var a = -3.0;
	var b = (-2.0 * sideWidth);
	var c = (Math.pow(sideWidth, 2)) + (Math.pow(sideHeight, 2));
	
	var z = (-b - Math.sqrt(Math.pow(b,2)-(4.0*a*c)))/(2.0*a);
	
	var x = (sideWidth - z)/2.0;
	
	HT.Hexagon.Static.WIDTH = sideWidth;
	HT.Hexagon.Static.HEIGHT = sideHeight;
	HT.Hexagon.Static.SIDE = z;
	return new HT.Grid(canvasWidth, canvasHeight);
}

function debugHexZR()
{
	findHexWithSideLengthZAndRatio();
	addHexToCanvasAndDraw(20, 20);
}

function debugHexWH()
{
	findHexWithWidthAndHeight();
	addHexToCanvasAndDraw(20, 20);
}

function addHexToCanvasAndDraw(x, y)
{
	HT.Hexagon.Static.DRAWSTATS = true;
	var hex = new HT.Hexagon(null, x, y);
	
	var canvas = document.getElementById("hexCanvas");
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, 800, 600);
	hex.draw(ctx);
}
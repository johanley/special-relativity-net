/**
 Simple 2D chart, showing the relation between beta, gamma, and the interval.
 A moving line cycles through different values of beta, etc.
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;
var ZOOM = 3.5;

var TEXT_COLOR = "rgb(0,255,0)";
var BACKGROUND = "rgb(13,66,18)"; 

var startTime = millis(); 

/** Draw the canvas, using the num seconds since the start of the animation. */
function drawCanvas(ctx){
  styles(ctx);
  ctx.save();
  transforms(ctx);
  drawStaticParts(ctx);
  drawChangingLines(ctx);
  ctx.restore();
}

function styles(ctx){
  //ctx.fillStyle = 'rgb(100,100,100)'; 
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.strokeStyle = 'rgb(0,255,0)';
  myFont(ctx);
}

function transforms(ctx){
  ctx.scale(ZOOM,ZOOM);
  ctx.translate(30,5);
}

function drawStaticParts(ctx){
  smallAxes(ctx);  
  ctx.lineWidth=1;
  line(ctx,30,140,150,20);//light cone
  //tick marks and the beta-scale
  line(ctx,30,20,150,20);
  text(ctx,'\u03B2', 87, 10, TEXT_COLOR); 
  for(idx=0;idx<=20;++idx){
    var tickSize = idx % 2 ? 2 : 4;
    tickMarkVertical(ctx,30+6*idx,20,tickSize);
  }
  //tick marks for finding gamma
  ctx.save();
  ctx.font = "15px Times New Roman";
  text(ctx,'\u03B3', 14, 82, TEXT_COLOR);
  ctx.restore();
  for(idx=0;idx<=40;++idx){
    var tickSize = idx % 10 ? 2 : 4;
    tickMarkHorizontal(ctx,30,20+idx*3,tickSize);
  }
  //surface of constant interval
  graphHyperbolaUp(ctx,30,140,0,117,900); 
}

function smallAxes(ctx){
  ctx.save();
  ctx.font = '12px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
  //both t,x axes
  line(ctx,5,155,5,110);
  arrowUp(ctx,5,110);
  text(ctx,'ct', 0, 103, TEXT_COLOR);
  line(ctx,5,155,50,155);
  arrowRight(ctx,50,155);
  text(ctx, 'x', 53, 155, TEXT_COLOR);
  ctx.restore();
}

/** 
 Two lines are drawn dynamically:
   - a history with the current beta; it intersects the hyperbola of constant interval
   - a line from ct-axis to the above-mentioned intersection
*/
function drawChangingLines(ctx){
  ctx.save();
  ctx.strokeStyle = 'rgb(255,255,255)'; 
  var beta = (secondsFromStart()%12)/12;
  var betaX = 30 + beta*120 ;
  line(ctx,30,140,betaX,20);
  var intersect = findIntersectionPoint(beta);
  line(ctx,30,intersect.y,intersect.x,intersect.y);
  //text(ctx,"beta:" + beta,10,5, TEXT_COLOR);
  //text(ctx,"intersect.x:" + intersect.x,10,30, TEXT_COLOR);
  //text(ctx,"intersect.y:" + intersect.y,10,40, TEXT_COLOR);
  
  ctx.save();
  ctx.font = "12px Times New Roman";
  text(ctx,'\u03B2 = ' + round(beta,2),100,100,TEXT_COLOR);
  text(ctx,'\u03B3 = ' + round(gamma(beta),2),100,113,TEXT_COLOR);
  ctx.restore();

  
  ctx.restore();
}

/** Return the intersection point of the beta-line with the hyperbola. */
function findIntersectionPoint(beta){
  var xval = 0;
  var yval = 0;
  if (beta<0.001){
    xval = 30;
    yval = 110;
  }
  else {
    var betaSq = beta*beta;
    var denom = Math.sqrt((1/betaSq) - 1);
    xval = (30/denom); 
    yval = (xval/beta); 
  }
  return {x:30+xval, y:140-yval}; //correct for the translation, and y-direction
}

//why can't i use the centralized gamma function here??
function gamma(beta){
  var radical = 1 - beta*beta;
  return 1/Math.sqrt(radical);
}

/** The current system time in millis. */
function millis(){
 return (new Date()).getTime();
}

function secondsFromStart(){
  var now = millis();
  return (now-startTime)/1000;
}
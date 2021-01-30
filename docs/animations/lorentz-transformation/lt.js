/**
 Calculate and show the Lorentz Transform for an event, between 2 grids.
 Shows two spots for the event coords, and the constant-interval hyperbola joining them.
 Show the numeric values for event coords as well, as text in the corner.
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR = "rgb(0,255,0)";
var SPOT_COLOR = "rgb(255,255,255)";
var GRID2_COLOR = "rgb(255,255,255)";
var FONT = 'bold 16px sans-serif';

var CENTER_X=480;
var CENTER_Y=300;

var SIZE=220;
var X_START=-SIZE;
var X_END=SIZE;

var Y_START=-SIZE;
var Y_END=SIZE;

var TEXT_OUTPUT = 20;

/** Draw the canvas, using user's input (or the default values). */
function drawLorentzTransform(ctx,x,ct,beta){
  defaultStyles(ctx);
  background(ctx);
  drawStaticParts(ctx);
  drawChangingParts(ctx,x,ct,beta);
}

/** Draw N events, and their lorentz transforms. */
function drawLorentzTransformMulti(ctx,x,ct,beta){
  defaultStyles(ctx);
  background(ctx);
  drawStaticParts(ctx);
  drawChangingPartsMulti(ctx,x,ct,beta);
}

function defaultStyles(ctx){
  ctx.fillStyle = BASE_COLOR; 
  ctx.strokeStyle = BASE_COLOR;
  ctx.font = FONT;
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
}

function background(ctx){
  ctx.save();
  ctx.fillStyle = BACKGROUND; 
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.restore();
}

function drawStaticParts(ctx){
  axes(ctx);  
  lightCone(ctx);
}

function axes(ctx){
  //both ct,x axes
  line(ctx,CENTER_X,CENTER_Y+SIZE,CENTER_X,CENTER_Y-SIZE);
  arrowUp(ctx,CENTER_X,CENTER_Y-SIZE);
  text(ctx,'ct', CENTER_X-8, CENTER_Y-SIZE-8, BASE_COLOR);
  
  line(ctx,CENTER_X-SIZE,CENTER_Y,CENTER_X+SIZE,CENTER_Y);
  arrowRight(ctx,CENTER_X+SIZE,CENTER_Y);
  text(ctx, 'x', CENTER_X+SIZE+5, CENTER_Y, BASE_COLOR);
}

function lightCone(ctx){
  line(ctx,CENTER_X-SIZE,CENTER_Y+SIZE,CENTER_X+SIZE,CENTER_Y-SIZE);
  line(ctx,CENTER_X-SIZE,CENTER_Y-SIZE,CENTER_X+SIZE,CENTER_Y+SIZE);
}

/** 
 Draw two spots for the same event, as measured in the two grids.
 Include the hyperbola of constant interval that joins them.
 Include the raw numbers as well in the corner, in case the user 
 just wants to use it as a calculator.
*/
function drawChangingParts(ctx,x,ct,beta){
  text(ctx,"Grid 1  x: " + x,TEXT_OUTPUT,20);
  text(ctx,"Grid 1 ct: " + ct,TEXT_OUTPUT,35);
  text(ctx,"\u03B2:   " + beta,TEXT_OUTPUT,80);
  
  grid1=coords(x,ct);
  spot(ctx,grid1.x,grid1.ct,4);
  
  hyperbolaOfConstantInterval(ctx,x,ct);

  //parts with a non-default color come last  
  var lt = lorentz(x,ct,beta);
  grid2=coords(lt.x,lt.ct);
  ctx.save();
  ctx.fillStyle=GRID2_COLOR;
  ctx.strokeStyle=GRID2_COLOR;
  text(ctx,"Grid 2  x: " + round(lt.x,2),TEXT_OUTPUT,110);
  text(ctx,"Grid 2 ct: " + round(lt.ct,2),TEXT_OUTPUT,127);
  spot(ctx,grid2.x,grid2.ct,4);
  ctx.restore();
}

function coords(xval,ctval){
  var result = {};
  result.x=CENTER_X+xval; //treats as a string
  result.ct=CENTER_Y-ctval;
  return result;
}

function hyperbolaOfConstantInterval(ctx,x,ct){
  var intervalSquare = ct*ct - x*x; //of event wrt the origin
  if (intervalSquare>0 && ct>0){
    graphHyperbolaUp(ctx,CENTER_X,CENTER_Y,X_START,X_END,intervalSquare);
  }
  else if (intervalSquare>0 && ct<0){
    graphHyperbolaDown(ctx,CENTER_X,CENTER_Y,X_START,X_END,intervalSquare);
  }
  else if (intervalSquare<0 && x>0){
    graphHyperbolaRight(ctx,CENTER_X,CENTER_Y,Y_START,Y_END,-intervalSquare);
  }
  else if (intervalSquare<0 && x<0){
    graphHyperbolaLeft(ctx,CENTER_X,CENTER_Y,Y_START,Y_END,-intervalSquare);
  }
  text(ctx,"s-squared: " + round(intervalSquare,2),TEXT_OUTPUT,65);
}
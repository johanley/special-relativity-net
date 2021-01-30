/**
 Show the apparent velocity of on object with respect to a detector, 
 as the intersection point of the detector's past light cone and the 
 object's history.
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR = "rgb(0,255,0)";
var SPOT_COLOR = "rgb(255,255,255)";
var GRID2_COLOR = "rgb(255,255,255)";
var TICK_COLOR = "rgb(0,0,0)";
var WRISTWATCH_TICK = 20; 

var CENTER_X=420;
var CENTER_Y=300;
var AXES_X=40;
var AXES_Y=560;
var AXES_SIZE=60;

var SIZE=235;
var X_START=-SIZE;
var X_END=SIZE;

var Y_START=-SIZE;
var Y_END=SIZE;

var TEXT_OUTPUT = 20;

var startTime = millis(); 
/** Each animation cycles back to the start after this many seconds. */
var TOTAL_TIME = 16;

/** 
 This animation has a fixed value for beta. 
 What changes instead is the position of the light cone.
*/
var beta=0.6; //has gamma=1.25 exactly

/** Current position of the apex of the light cone. */
var coneheady;
var coneheadx;


/** Recycles every N seconds, to restart the animation. */
function animationTime(){
  return secondsFromStart() % TOTAL_TIME;
}

/** Returns a fractional value. */
function secondsFromStart(){
  var now = millis();
  return (now-startTime)/1000;
}

/** The current system time in millis. */
function millis(){
 return (new Date()).getTime();
}

/** Absorb the latest user entries for controlling the animation. */
function applyUserInput(userbeta){
  startTime = millis(); 
  beta=userbeta;
}

/** 
 Draw histories, and their lorentz transforms, gradually increasing 
 beta from 0 to the value entered by the user.
*/
function drawCanvas(ctx){
  defaultStyles(ctx);
  background(ctx);
  drawStaticParts(ctx);
  coneheady=CENTER_Y+SIZE - (animationTime()/TOTAL_TIME)*2*SIZE;
  coneheadx=CENTER_X;
  drawChangingParts(ctx);
}

function defaultStyles(ctx){
  ctx.fillStyle = BASE_COLOR; 
  ctx.strokeStyle = BASE_COLOR;
  myBigFont(ctx);
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
  detectorHistory(ctx);
  objectHistory(ctx);
}

/** Small axes in the lower left. */
function axes(ctx){
  var size=40;
  line(ctx,AXES_X,AXES_Y,AXES_X,AXES_Y-AXES_SIZE);
  arrowUp(ctx,AXES_X,AXES_Y-AXES_SIZE);
  text(ctx,'ct', AXES_X-8, AXES_Y-AXES_SIZE-8, BASE_COLOR);
  
  line(ctx,AXES_X,AXES_Y,AXES_X+AXES_SIZE,AXES_Y);
  arrowRight(ctx,AXES_X+AXES_SIZE,AXES_Y);
  text(ctx, 'x', AXES_X+AXES_SIZE+5, AXES_Y, BASE_COLOR);
}

/** The history of the (stationary) detector. */
function detectorHistory(ctx){
  line(ctx,CENTER_X,540,CENTER_X,60);
  text(ctx,'Detector', CENTER_X-35, 35, BASE_COLOR);
  text(ctx,'and its past light cone', CENTER_X-85, 50, BASE_COLOR);
}

/** The history, at the proper slope for the given beta. The history is fixed, and doesn't move. */
function objectHistory(ctx){
  ctx.save();
  ctx.strokeStyle="rgb(255,255,255)";
  ctx.fillStyle="rgb(255,255,255)";
  line(ctx,CENTER_X-SIZE*2*beta,CENTER_Y+SIZE*2, CENTER_X+SIZE*2*beta,CENTER_Y-SIZE*2);
  text(ctx,'Emitter', (CENTER_X-SIZE*beta)-2,CENTER_Y+SIZE+20);
  ctx.restore();
}

/**   
  The past light cone of the detector.
  The intersection point of the light cone and the object's history.
  The apparent distance: horizontal delta-x from the cone-head (!).
*/
function drawChangingParts(ctx){
  detectorsPastLightCone(ctx);
  intersectionOfLightConeAndHistory(ctx);
}

function detectorsPastLightCone(ctx){
  line(ctx,coneheadx,coneheady,coneheadx-2*SIZE,coneheady+2*SIZE);
  line(ctx,coneheadx,coneheady,coneheadx+2*SIZE,coneheady+2*SIZE);
  spot(ctx,coneheadx,coneheady,2);
}

function intersectionOfLightConeAndHistory(ctx){
  //find the intersection of two lines
  var dx,dx;
  if (coneheady>CENTER_Y){
    //approaching
    dx=(beta/(1-beta))*(coneheady-CENTER_Y);
  }
  else {
    //receding
    dx=(beta/(1+beta))*(coneheady-CENTER_Y);
  }
  dy=-dx/beta;
  spot(ctx,CENTER_X-dx,CENTER_Y-dy,2);
  if (CENTER_Y-dy<HEIGHT){
    //horizontal line for the apparent distance
    ctx.save();
    ctx.strokeStyle="rgb(100,100,255)";
    ctx.fillStyle="rgb(100,100,255)";
    line(ctx,CENTER_X,coneheady,CENTER_X-dx,coneheady);
    spot(ctx,CENTER_X-dx,coneheady,2);
    ctx.restore();
  }
}
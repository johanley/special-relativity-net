/**
 Demonstrate the origin of the doppler effect.
 In a given grid, signals are sent from a moving source to stationary detectors.
 The moving source emits c-signals at regular intervals of wristwatch time.
 Those c-signals are picked up by two stationary detectors - one on each side of the moving source.
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR = "rgb(0,255,0)";
var SPOT_COLOR = "rgb(255,255,255)";
var TICK_COLOR = "rgb(0,0,0)";
/** Basic scale of the diagram. */
var SIZE = 265;//220; 
var WRISTWATCH_TICK = 20; 
var NUM_DETECTOR_TICKS=13; 

var CTRX=420;
var CTRY=300;

var startTime = millis(); 
/** Each animation cycles back to the start after this many seconds. */
var TOTAL_TIME=10;

/** 
 User input, which controls the animation.  
*/
var beta=-0.6; //has gamma=1.25 exactly
/** The value of beta to use for the current animation. */
var currentBetaVal=0.6;
var anim=true;

/** Absorb the latest user entries for controlling the animation. */
function applyUserInput(userbeta,useranim){
  startTime = millis(); 
  beta=userbeta;
  anim=useranim;
}

/**  Draw histories for 2 stationary detectors, and one moving source radiating a signal.*/
function drawCanvas(ctx){
  defaultStyles(ctx);
  background(ctx);
  currentBetaVal=currentBeta();
  drawStaticParts(ctx);
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
  detectors(ctx);  
  axes(ctx);
}

/** One detector on the left, one on the right. Each with tick marks showing wristwatch time. */
function detectors(ctx){
  line(ctx,CTRX-SIZE,CTRY-SIZE,CTRX-SIZE,CTRY+SIZE);
  line(ctx,CTRX+SIZE,CTRY-SIZE,CTRX+SIZE,CTRY+SIZE);
  var tweak=10;
  text(ctx,"Detector 1",CTRX-SIZE-4*tweak,CTRY+SIZE+tweak);
  text(ctx,"Detector 2",CTRX+SIZE-4*tweak,CTRY+SIZE+tweak);
  ctx.save();
  ctx.fillStyle=SPOT_COLOR;
  for(var idx=0; idx<=NUM_DETECTOR_TICKS; ++idx){
    var dist=idx*WRISTWATCH_TICK;
    spot(ctx,CTRX-SIZE,CTRY+dist,1); //left
    spot(ctx,CTRX-SIZE,CTRY-dist,1);
    spot(ctx,CTRX+SIZE,CTRY+dist,1); //right
    spot(ctx,CTRX+SIZE,CTRY-dist,1);
  }
  ctx.restore();
}

/** Both ct and x axes. */
function axes(ctx){
  var axesSize=SIZE/10;
  ctx.save();
  line(ctx,CTRX,CTRY+axesSize,CTRX,CTRY-axesSize);
  arrowUp(ctx,CTRX,CTRY-axesSize);
  text(ctx,'ct', CTRX-6, CTRY-axesSize-8, BASE_COLOR);
  
  line(ctx,CTRX-axesSize,CTRY,CTRX+axesSize,CTRY);
  arrowRight(ctx,CTRX+axesSize,CTRY);
  text(ctx, 'x', CTRX+axesSize+5, CTRY, BASE_COLOR);
  ctx.restore();
}

/**   
 The history of the source, and the histories of c-signals from regularly spaced events along 
 the source's history.
*/
function drawChangingParts(ctx){
  headsUpDisplay(ctx);
  signalSourceHistory(ctx);
  signalHistories(ctx);
}

/** Display some important numbers as name-value pairs. */
function headsUpDisplay(ctx){
  var headsUpY=0.05*HEIGHT;
  var headsUpX=0.02*WIDTH;
  var SPACING=20;
  var dmax=currentBetaVal<0?Math.PI:0;
  var dmin=currentBetaVal<0?0:Math.PI;

  ctx.save();
  ctx.font = "20px Times New Roman";
  text(ctx,"\u03B2 = "+round(currentBetaVal,2),headsUpX,headsUpY+SPACING*0);
  text(ctx,"\u03B3 = "+round(gamma(currentBetaVal),2),headsUpX,headsUpY+SPACING*1);
  text(ctx,"D max = "+round(doppler1(dmax),2),headsUpX,headsUpY+SPACING*2);
  text(ctx,"D min = "+round(doppler1(dmin),2),headsUpX,headsUpY+SPACING*3);
  ctx.restore();
}

function doppler1(theta){
  return doppler(currentBetaVal,theta);
}

function signalSourceHistory(ctx){
  var deltax=currentBetaVal*SIZE;
  var deltat=SIZE;
  line(ctx,CTRX-deltax,CTRY+deltat,CTRX+deltax,CTRY-deltat); //start lower left
  text(ctx,"Emitter",CTRX-deltax,CTRY+deltat+10);
}

/** Signals emitted from the source at regular intervals of wristwatch time. */
function signalHistories(ctx){
  //find the events that correspond to N ticks of wristwatch time
  var gammaVal=gamma(currentBetaVal);
  ctx.save();
  ctx.fillStyle=SPOT_COLOR;
  for(var idx=0;idx<=NUM_DETECTOR_TICKS;++idx){
    var deltat=gammaVal*idx*WRISTWATCH_TICK; //time dilation
    var deltax=currentBetaVal*deltat;
    if (deltax<SIZE && deltat<SIZE){
      spot(ctx,CTRX+deltax,CTRY-deltat,1);
      spot(ctx,CTRX-deltax,CTRY+deltat,1);
      lightCones(ctx,deltax,deltat);
    }
  }
  ctx.restore();
}

/** 
 Two light cones, for two events on the source's history, symmetric about the origin. 
 The light cones end at the detectors.
*/
function lightCones(ctx,deltax,deltat){
  //towards the left detector
  var deltaleft=SIZE-deltax;
  line(ctx,CTRX-deltax,CTRY+deltat, CTRX-SIZE,CTRY+deltat-deltaleft); 

  //towards the right detector
  var deltaright=SIZE+deltax;
  line(ctx,CTRX-deltax,CTRY+deltat, CTRX+SIZE,CTRY+deltat-deltaright); 
}

/**
 Return a value for beta, to be used to draw the animation.
 Returns a value between 0 and the value entered by the user.
 If the animation is turned off, then just return the beta value entered by the user,
 with no modification.
*/
function currentBeta(){
  var betaAnim = animationTime()/TOTAL_TIME * beta;
  return anim ? betaAnim : beta;
}

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
/**
 Example 2D histories, for various kinds of motion.
 The motion is shown along a line parallel to the x-axis, and the corresponding 
 history is shown in ct-x space. A moving dot represents the motion.
 A trailing line for the dot is used only in ct-x space.
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR = "rgb(0,255,0)";
var SPOT_COLOR = "rgb(255,255,255)";

//the line where the object moves horizontally
var BASE_Y = 520;

//start the history just above the object
var SEPARATION = 10;

//what a second of time corresponds to on the vertical axis
//no attempt is made here to use 'ct' on the vertical axis
var Y_SCALE = 32;

var X_SCALE = 32;
var START_X = 80;
var END_X = 740;

//each animation cycles back to the start after this time
var TOTAL_TIME = 15;

/** The motion selected by the user. */
var motion = example4;  //default

var startTime = millis(); 
var currentAnimationCycle = 0;
var firstLoad = true;

/** Start over with a new function. */
function applyUserInput(selectedMotion){
  startTime = millis(); 
  currentAnimationCycle = 0;
  firstLoad = true;
  
  motion = selectedMotion;
}

/**  
 Draw the canvas, using the num seconds since the start of the animation. 
 This animation controls its own erasure, piece by piece; the reason is that 
 this is an effective means of generating a 'trace' of how a dot moves, one draw at a time.
*/
function drawCanvas(ctx){
  defaultStyles(ctx);
  if (firstLoad){
    background(ctx);
    firstLoad = false;
  }
  drawStaticParts(ctx);
  drawChangingParts(ctx);
}

function background(ctx){
  ctx.save();
  ctx.fillStyle = BACKGROUND; 
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.restore();
}

function defaultStyles(ctx){
  ctx.fillStyle = BASE_COLOR; 
  ctx.strokeStyle = BASE_COLOR;
  myBigFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
}

function drawStaticParts(ctx){
  smallAxes(ctx);  
}

function smallAxes(ctx){
  //both t,x axes
  var xpos=START_X-20;
  var ypos=540;
  var size=80;
  line(ctx,xpos,ypos,xpos,ypos-size);
  arrowUp(ctx,xpos,ypos-size);
  text(ctx,'T', xpos-5,ypos-size-10, BASE_COLOR);
  line(ctx,xpos,ypos,xpos+size,ypos);
  arrowRight(ctx,xpos+size,ypos);
  text(ctx, 'X', 170, 540, BASE_COLOR);
}

/** 
 Various canned histories can be shown, according to what the user has selected.
 Two items are drawn dynamically:
   - a spot moving horizontally only, to represent the object
   - a corresponding history, as a continuously growing line, in sync with the moving object,
     updated with its latest position.
*/
function drawChangingParts(ctx){
  eraseMotion(ctx);
  eraseHistoryAtEndOfAnimationCycle(ctx);
  var animTime = animationTime();
  var example = exampleChosenByUser();
  var sample = example(animTime);
  var yval = (BASE_Y - SEPARATION) - animTime*Y_SCALE;
  ctx.save();
  ctx.fillStyle = SPOT_COLOR; 
  ctx.strokeStyle = SPOT_COLOR; 
  spot(ctx,sample.x,BASE_Y,4);
  ctx.restore();
  spot(ctx,sample.x,yval,1);
  text(ctx,sample.title,START_X,20);
}

/** Clear just the horizontal motion of the object (every drawing cycle). */
function eraseMotion(ctx){
  ctx.save();
  ctx.clearRect(START_X-5,BASE_Y-5,WIDTH,10); 
  ctx.fillStyle = BACKGROUND; 
  ctx.fillRect(START_X-5,BASE_Y-5,WIDTH,10);
  ctx.restore();
}

/** Clear the history, at the end of each full animation cycle. */
function eraseHistoryAtEndOfAnimationCycle(ctx){
  var animCycle = animationCycle();
  if (currentAnimationCycle < animCycle){
    ctx.save();
    ctx.clearRect(70,0,WIDTH,BASE_Y-SEPARATION+5); 
    ctx.fillStyle = BACKGROUND; 
    ctx.fillRect(70,0,WIDTH,BASE_Y-SEPARATION+5);
    ctx.restore();
    currentAnimationCycle = animCycle;
  }
}

/**
 Each example function takes in the current time since the start of the 
 animation, and returns the x-coord of the object; it also returns a 
 title, a text description of the motion.
 The passed time parameter recycles in value; that part doesn't need to be 
 managed by implementations.
*/
function exampleChosenByUser(){
  return motion;
}

/** Stationary. */
function example1(timeIdx){
  return {x:400, title:"Stationary"};
}

/** Uniform speed to the right. */
function example2(timeIdx){
  return {x:(START_X + timeIdx*X_SCALE), title:"Uniform speed to the right"};
}

/** Uniform speed to the left. */
function example3(timeIdx){
  return {x:END_X - timeIdx*X_SCALE, title:"Uniform speed to the left"};
}

/** Harmonic oscillator. */
function example4(timeIdx){
  return {x:(WIDTH/2 + 100*Math.sin(10*timeIdx/10)), title:"Oscillator"};
}

/** Linear acceleration. */
function example5(timeIdx){
  return {x:(START_X + 2*timeIdx*timeIdx), title:"Speeding up"};
}

/** Linear de-celeration. */
function example6(timeIdx){
  return {x:(WIDTH/2 + 30*timeIdx - 2*timeIdx*timeIdx), title:"Slow down, then reverse"};
}

/** Damped oscillator. */
function example7(timeIdx){
  return {x:(WIDTH/2 + Math.exp(-1*timeIdx/5)*100*Math.sin(10*timeIdx/10)), title:"Damped oscillator"};
}

/** Harmonic oscillator - fast. */
function example8(timeIdx){
  return {x:(WIDTH/2 + 40*Math.sin(30*timeIdx/10)), title:"Fast oscillator"};
}

/** Bounce back and forth few times. */
function example9(timeIdx){
  var result = 0;
  var turningPoint = 4;
  if (timeIdx<turningPoint){
    result = 4*START_X + timeIdx*X_SCALE;
  }
  else if (timeIdx<2*turningPoint) {
    result = (4*START_X + turningPoint*X_SCALE) - (timeIdx - turningPoint)*X_SCALE;
  }
  else if (timeIdx<3*turningPoint) {
    result = 4*START_X + (timeIdx-2*turningPoint)*X_SCALE;
  }
  else if (timeIdx<4*turningPoint) {
    result = (4*START_X + turningPoint*X_SCALE) - (timeIdx - 3*turningPoint)*X_SCALE;
  }
  return {x:result, title:"Bouncing back and forth"};
}


/** Increments by 1, after each full animation cycle. */
function animationCycle(){
  return Math.floor(secondsFromStart()/TOTAL_TIME);
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
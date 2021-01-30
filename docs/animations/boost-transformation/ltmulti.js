/**
 Calculate and show the Lorentz Transform for histories, as an animation from 
 beta=0 to beta=some value entered by the user.
 This animation is good for showing the stretch and squeeze effect.
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

var SIZE=220;
var X_START=-SIZE;
var X_END=SIZE;

var Y_START=-SIZE;
var Y_END=SIZE;

var TEXT_OUTPUT = 20;

var startTime = millis(); 
/** Each animation cycles back to the start after this many seconds. */
var TOTAL_TIME = 6;

/** 
 User input, which controls the animation.  
 Values shown here are the default values.
*/
var hist1="-50,-80,-50,80";
var hist2="50,-80,50,80";
var beta=-0.6; //has gamma=1.25 exactly
var anim=true;

/** Absorb the latest user entries for controlling the animation. */
function applyUserInput(userhist1,userhist2,userbeta,useranim){
  startTime = millis(); 
  hist1=userhist1;
  hist2=userhist2;
  beta=userbeta;
  anim=useranim;
}

/** 
 Draw histories, and their lorentz transforms, gradually increasing 
 beta from 0 to the value entered by the user.
*/
function drawLorentzTransformMulti(ctx){
  defaultStyles(ctx);
  background(ctx);
  drawStaticParts(ctx);
  drawChangingPartsMulti(ctx,hist1,hist2,beta);
}

function defaultStyles(ctx){
  myBigFont(ctx);
  ctx.fillStyle = BASE_COLOR; 
  ctx.strokeStyle = BASE_COLOR;
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

/** Displacement of the origin. */
function coords(xval,ctval){
  var result = {};
  result.x=CENTER_X+xval; //treats as a string
  result.ct=CENTER_Y-ctval;
  return result;
}

/**   
 Draw each history as a joined sequence of spots.
 Draw the Lorentz transform of each history, also as a joined sequence of spots, 
 but in a different color.
*/
function drawChangingPartsMulti(ctx,hist1/*raw string*/,hist2/*raw string*/,beta){
  drawHistory(ctx,hist1,beta);
  drawHistory(ctx,hist2,beta);
}

function drawHistory(ctx,rawhistory/*raw string of events*/,beta){
  var events=parseHistoryStringIntoEvents(rawhistory);
  plotHistory(ctx,events,BASE_COLOR);
  var betaFraction = currentBeta(beta);
  text(ctx,"\u03B2:   " + round(betaFraction,2),TEXT_OUTPUT,20);
  text(ctx,"\u0393:   " + round(gamma(betaFraction),2),TEXT_OUTPUT,50);
  plotHistory(ctx,transformAll(events,betaFraction),GRID2_COLOR); 
}

/** 
 Example input format for a history: 
   -100,200,300,400
 This is parsed pairwise into 2 events (in general, N events):
  (x,ct)=(-100,200)
  (x,ct)=(300,400)
  
 Return an array of event objects.
*/
function parseHistoryStringIntoEvents(history){
  var items = history.split(",");
  var numEvents = items.length/2; //the length must be even, for valid input
  var result = new Array(numEvents);
  for(var idx=0; idx<items.length; idx=idx+2){
    var event = {};
    event.x = parseFloat(items[idx]);
    event.ct = parseFloat(items[idx+1]);
    //the index for the result array is half that of the items array
    result[idx/2] = event;
  }
  return result;
}

/** 
 Plot each event as a spot.
 Join the spots to form a history.
 Add spots along each line segment to indicate wristwatch time.
*/
function plotHistory(ctx,events /*array of objects with x,ct*/,color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  //spot for each event
  for(var idx=0; idx<events.length; ++idx){
    var event = events[idx]; 
    var spotCoords=coords(event.x,event.ct);
    spot(ctx,spotCoords.x,spotCoords.ct,2);
  }
  //join all of the spots with line segments
  joinAllEvents(ctx,events);
  ctx.restore(); //original colors
  //between each pair of spots, add ticks to represent a wristwatch
  for(var idx=0; idx<events.length; ++idx){
    //even indexes only
    if (idx%2>0) continue; 
    var startevent = events[idx]; 
    var endevent = events[idx+1]; 
    addTimeDots(ctx,startevent,endevent);
  }
}

/** Join all of the events with line segments. */
function joinAllEvents(ctx,events){
  ctx.beginPath();
  var spotCoords=coords(events[0].x,events[0].ct);
  ctx.moveTo(spotCoords.x,spotCoords.ct);
  for(var idx=1; idx<events.length; ++idx){
    spotCoords=coords(events[idx].x,events[idx].ct);
    ctx.lineTo(spotCoords.x,spotCoords.ct);
  }
  ctx.stroke();
  ctx.closePath();
}

/**
 Add small dots between the given events, to represent the ticking of 
 a wristwatch as it travels between the two events.
*/
function addTimeDots(ctx,startevent,endevent){
  var beta=(endevent.x-startevent.x)/(endevent.ct-startevent.ct); // can be 0
  var gammaVal = gamma(beta);
  var deltax=0; //for each tick
  var deltact=0; //for each tick
  var tau=0; //the wristwatch time
  ctx.save();
  ctx.fillStyle=TICK_COLOR;
  ctx.strokeStyle=TICK_COLOR;
  while ((startevent.ct+deltact)<endevent.ct){
    tau=tau+WRISTWATCH_TICK; 
    deltact=gammaVal*tau;
    deltax=beta*deltact;
    if ((startevent.ct+deltact)<(endevent.ct-0.1)){
      var spotCoords=coords(startevent.x+deltax,startevent.ct+deltact);
      spot(ctx,spotCoords.x,spotCoords.ct,1);
    }
  }
  ctx.restore();
}

/**
 Return an array of event objects, containing the Lorentz transform 
 of each given event, retaining the corresponding sequence as the given events.
*/
function transformAll(events,beta){
  var result = new Array(events.length);
  for(var idx=0; idx<events.length; ++idx){
    var transformedEvent = lorentz(events[idx].x, events[idx].ct, beta);
    result[idx] = transformedEvent;
  }
  return result;
}

/**
 Return a value for beta, to be used to draw the animation.
 Returns a value between 0 and the value entered by the user.
 If the animation is turned off, then just return the beta value entered by the user,
 with no modification.
*/
function currentBeta(beta){
  return anim ? beta * (animationTime()/TOTAL_TIME) : beta;
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
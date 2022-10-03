/**
 View the light cone from the ct axis, to see how the boost transformation 
 affects events on the light-cone of some given event.
*/

//the coords assume 800*600
var WIDTH=800;
var HEIGHT=600;
var CTRX=WIDTH/2;
var CTRY=0.85*HEIGHT;
var RADIUS=HEIGHT/8;

var CTRX_ELLIPSE=WIDTH/2;
var CTRY_ELLIPSE=HEIGHT/4;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR="rgb(0,255,0)";
var RED="rgb(242,153,153)";
var BLUE="rgb(166,233,255)";
var TRANSFORMED_CONE="rgb(255,255,255)";

/** Used in the stepwise creation of the transformed circle (as an ellipse). */ 
var NUM_STEPS=720;
var ROTATION_AROUND_X_AXIS=radians(10); 

var startTime = millis(); 
var TOTAL_TIME = 8; //seconds

/** Input from user. */
var maxBeta=0.60;
/** Num radial lines to use. */
var numRadialLines=8;
/** The value of beta to use for the current animation. */
var currentBetaVal=0.6;
/** Whether or not to animate the graph. */
var anim=true;

/** Use the request param or user entry for the max value of beta to use. */
function applyUserInput(betaUser,numRadialLinesUser,animUser){
  startTime=millis(); 
  maxBeta=betaUser;
  numRadialLines=numRadialLinesUser;
  anim=animUser;
}

/** Draw the canvas, using the num seconds since the start of the animation. */
function drawCanvas(ctx){
  styles(ctx);
  background(ctx);
  ctx.save();
  drawStaticParts(ctx);
  currentBetaVal=currentBeta();
  drawChangingLines(ctx);
  ctx.restore();
}

function styles(ctx){
  myBigFont(ctx);
  ctx.strokeStyle=BASE_COLOR;
  ctx.fillStyle=BASE_COLOR;
  ctx.lineWidth=2;
}

function background(ctx){
  ctx.save();
  ctx.fillStyle=BACKGROUND;
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.restore();
}

/** Axes for the light cone. */
function drawStaticParts(ctx){
  axesAndLightCone(ctx);
  text(ctx,"Top view of the light cone",WIDTH/2-90,HEIGHT/2);
  arrowUp(ctx,WIDTH/2,HEIGHT/2-34);
  line(ctx,WIDTH/2,HEIGHT/2-34,WIDTH/2,HEIGHT/2-20);
}

function drawChangingLines(ctx){
  headsUpDisplay(ctx);
  drawLorentzTransformEllipse(ctx);
  drawLorentzTransformCone(ctx);
}

/** 
 View of the (boosted) future light cone from the top. 
 The figure is an ellipse. One focus is the origin.
 Various radii: length corresponds to doppler factor, direction corresponds to aberration.
*/
function drawLorentzTransformEllipse(ctx){
  var events = new Array(NUM_STEPS);
  //first do the physics and find the new events
  var steprads=2*Math.PI/NUM_STEPS;
  var betaVal=currentBetaVal;
  for (var idx=0;idx<NUM_STEPS;++idx){
    events[idx]=boostOnly(steprads*idx,betaVal);
  }
  //show the events
  var changeColor=colorTransitions(events);
  drawEllipseSlice(ctx,events.slice(0,changeColor.a));
  drawEllipseSlice(ctx,events.slice(changeColor.a,changeColor.b));
  drawEllipseSlice(ctx,events.slice(changeColor.b));
  radialLinesEllipse(ctx,betaVal);
}
/** The events must share the same color. */
function drawEllipseSlice(ctx,events){
  ctx.save();
  ctx.strokeStyle=events[0].isRed ? RED: BLUE;
  ctx.beginPath();
  // missing links between adjoining slices
  // this is actually desirable, since the endpoints are different, there's no way of deciding 
  // which color should be used; we leave the jumps blank, and let the background show through
  ctx.moveTo(CTRX_ELLIPSE+events[0].x,CTRY_ELLIPSE+events[0].y);
  for (var idx=1;idx<events.length;++idx){
    ctx.lineTo(CTRX_ELLIPSE+events[idx].x,CTRY_ELLIPSE+events[idx].y);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}
function radialLinesEllipse(ctx,betaVal){
  //radial lines to show aberration
  //use colors to show redshift versus blueshift
  ctx.save();
  ctx.lineWidth=1;
  var steprads = (2*Math.PI)/numRadialLines;
  for (var idx=1; idx<=numRadialLines; ++idx){
    var rads=steprads*idx;
    var boost=boostOnly(rads,betaVal);
    ctx.save();
    ctx.strokeStyle=boost.isRed ? RED : BLUE;
    line(ctx,CTRX_ELLIPSE,CTRY_ELLIPSE,CTRX_ELLIPSE+boost.x,CTRY_ELLIPSE+boost.y);
    ctx.restore();
  }
  ctx.restore();
}


/**
 Light cone distorted by a boost, shown in an oblique view.
 The physics is only clear from a top-level view, where you can see both aberration 
 and the Doppler effect most clearly. However, the user has to know the context of 
 what that view refers to. This cone is meant to do define that context.
 
 Uses a simple flat projection onto the z=0 plane.
 We pick a spot in the +x+y+z quadrant, and do the physics relative to that spot (the z value doesn't matter).
 After the physics is done, rotate a bit around the x-axis so that we can see inside 
 the top of the light cone. After all that's done, project onto the z=0 plane, and draw 
 with respect to a chosen center.
*/
function drawLorentzTransformCone(ctx){
  radialLinesLightCone(ctx); //do this first, for better 'line cross-over'
  topOfTheLightCone(ctx);
}
function radialLinesLightCone(ctx){
  //radial lines to show aberration
  //use colors to show redshift versus blueshift
  var steprads = (2*Math.PI)/numRadialLines;
  for (var idx=1; idx<=numRadialLines; ++idx){
    var rads=steprads*idx;
    var boostRotated=boostAndRotate(rads);
    ctx.save();
    ctx.strokeStyle=boostRotated.isRed ? RED : BLUE;
    line(ctx,CTRX,CTRY,CTRX+boostRotated.x,CTRY-boostRotated.z);
    ctx.restore();
  }
}
function topOfTheLightCone(ctx){
  //calc all events first, to later detect the red/blue transition
  var events = new Array(NUM_STEPS);
  var steprads=2*Math.PI/NUM_STEPS;
  for (var idx=0;idx<NUM_STEPS;++idx){
    events[idx] = boostAndRotate(steprads*idx);
  }
  var changeColor=colorTransitions(events);
  drawLightConeSlice(ctx,events.slice(0,changeColor.a));
  drawLightConeSlice(ctx,events.slice(changeColor.a,changeColor.b));
  drawLightConeSlice(ctx,events.slice(changeColor.b));
}
/** 
 Return an object with two indices, indicating the two transition points where the color changes.
 Hard coded to expect 2 transition points, demarcating 3 color zones in the events, alternating 
 between red and blue. The indices are used in the same style as Arrays.slice, where the end-index
 is excluded from the slice.
*/
function colorTransitions(lightConeEvents){
  var result={};
  var isCurrentRed=lightConeEvents[0].isRed; //the first color zone
  for(var idx=1;idx<lightConeEvents.length;++idx){
    if(lightConeEvents[idx].isRed != isCurrentRed){
      if (result.a){
        result.b=idx; //the third color zone has started
        break; //assume no more transitions
      }
      else {
        result.a=idx; //the second color zone has started
        isCurrentRed=lightConeEvents[idx].isRed; //the color of the second zone
      }
    }
  }
  return result;
}
/** The events must share the same color. */
function drawLightConeSlice(ctx,events){
  ctx.save();
  ctx.strokeStyle=events[0].isRed ? RED: BLUE;
  ctx.beginPath();
  // missing links between adjoining slices
  // this is actually desirable, since the endpoints are different, there's no way of deciding 
  // which color should be used; we leave the jumps blank, and let the background show through
  ctx.moveTo(CTRX+events[0].x,CTRY-events[0].z);
  for (var idx=1;idx<events.length;++idx){
    ctx.lineTo(CTRX+events[idx].x,CTRY-events[idx].z);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/** 
 Return an xyx point for a light-cone event characterized by the angle from the x-axis. 
 Also return an indicator for red versus blue.
*/
function boostAndRotate(rads){
  //transform the event to the moving grid
  var boost=boostOnly(rads);
  //rotate it a bit so the top of the light cone is visible
  var deltay=RADIUS*Math.sin(rads);
  var point={x:boost.x,y:deltay,z:boost.ct};
  var result=rotate(point,0,ROTATION_AROUND_X_AXIS,0);
  result.isRed=boost.isRed;
  return result;
}
/**
 Boost an event on the light cone, characterized by an angle. 
 Return as well an indicator of whether the event is redshifted or not.
 Return as well the y coordinate.
*/
function boostOnly(rads){
  //do the physics in abstract coords, unrelated to the screen; scale it with RADIUS
  //event coords in the rest grid, in a circle round about the ct axis
  var deltact=RADIUS;
  var deltax=RADIUS*Math.cos(rads);
  var deltay=RADIUS*Math.sin(rads);
  //transform the event to the moving grid
  var boost=lorentz(deltax,deltact,currentBetaVal);
  boost.isRed=distance(boost.x,deltay,0,0)<RADIUS;
  boost.y=deltay;
  return boost;
}

/** The axes don't need to be rotated.*/
function axesAndLightCone(ctx){
  var sizeAxis=150;
  line(ctx,CTRX,CTRY,CTRX+sizeAxis,CTRY); //x to the right
  arrowRight(ctx,CTRX+sizeAxis,CTRY);
  text(ctx,"x",CTRX+sizeAxis+5,CTRY+5);
  
  line(ctx,CTRX,CTRY,CTRX,CTRY-sizeAxis); //ct going up
  arrowUp(ctx,CTRX,CTRY-sizeAxis);
  text(ctx,"ct",CTRX-8,CTRY-sizeAxis-5);
  
  var endX=CTRX-sizeAxis*0.10;
  var endY=CTRY+sizeAxis*0.25;
  line(ctx,CTRX,CTRY,endX,endY); //y towards the viewer
  text(ctx,"y",endX-10,endY+10);
  line(ctx,endX,endY,endX+2,endY-12); //arrow head
  line(ctx,endX,endY,endX+4,endY+2); //arrow head
}

function doppler1(theta){
  return doppler(currentBetaVal,theta);
}

/** Display some important numbers as name-value pairs. */
function headsUpDisplay(ctx){
  var headsUpY=0.70*HEIGHT;
  var headsUpX=0.05*WIDTH;
  var SPACING=20;
  var dmax=currentBetaVal<0?Math.PI:0;
  var dmin=currentBetaVal<0?0:Math.PI;
  ctx.save();
  ctx.font = "20px Times New Roman";
  text(ctx,"\u03B2 = "+round(currentBetaVal,2),headsUpX,headsUpY+SPACING*2);
  text(ctx,"D max = "+round(doppler1(dmax),2),headsUpX,headsUpY+SPACING*3);
  text(ctx,"D min = "+round(doppler1(dmin),2),headsUpX,headsUpY+SPACING*4);
  text(ctx,"Neutral Radius = " + round(degrees(dopplerNeutralAngle(Math.abs(currentBetaVal))),2) + "\u00B0",headsUpX,headsUpY+SPACING*5);
  text(ctx,"Half-Sky Radius = "+round(degrees(aberrationHalfSky(currentBetaVal)),2) + "\u00B0",headsUpX,headsUpY+SPACING*6);
  text(ctx,"\u03B3 = "+round(gamma(currentBetaVal),2),headsUpX,headsUpY+SPACING*7);
  ctx.restore();
}

function currentBeta(){
  var betaAnim = animationTime()/TOTAL_TIME * maxBeta;
  return anim ? betaAnim : maxBeta;
}

/** Recycles every N seconds, to restart the animation. */
function animationTime(){
  var result=secondsFromStart() % TOTAL_TIME;
  return result;
}

/** The current system time in millis. */
function millis(){
 return (new Date()).getTime();
}

function secondsFromStart(){
  var now = millis();
  return (now-startTime)/1000;
}
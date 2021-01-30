/**
 Calculate and show the motion of an astrophysical jet.
 Assumes a jet has two luminous anti-parallel parts (blobs), ejected out of a central, visible source. 
 The two blobs are ejected with the same speed from the source, in opposite directions.
 Assumes a relatively nearby microquasar, with no Hubble recession of the central source.
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;
var BASE_COLOR = "rgb(0,255,0)";
var BACKGROUND = "rgb(13,66,18)"; 
var INVISIBLE_COLOR = "rgb(255,255,255)";

var Y_START=125;
var ROW_HEIGHT=35;
var SOURCE_X=WIDTH/2; //the central source

var COL_SPACE=40;
var COL_RIGHT=660;
var COL_LEFT=10;
var SIZE_CHART_Y=525;

/** 
 Distance on screen for a photon travelling in unit time. 
 For a microquasar a light-day is about right.
*/
var LIGHT_DAY=10; 
/** How big to draw a spot for unit brightness. */
var SIZE_UNIT_BRIGHTNESS=2;

var startTime = millis(); 
/** Each animation cycles back to the start after this many seconds. */
var TOTAL_TIME = 8;
/** The speed of the blobs with respect to the central source. */
var beta=0.95; //has gamma=1.25 exactly
/** 
 The angle between the line of sight and the motion of the right hand blob. 0..180 
 The left-hand blob uses the pi-complement of this angle.
*/
var theta=radians(68);
/** The brightness of the blob in its own rest grid. The source brightness=1.*/
var brightness=1.0;
/** When the brightness of a blob is below this limit, then it's not shown. */
var brightnessLimit=0.05;
/** Toggle on to force the display of invisible blobs, that fall below the brightness limit. */
var showInvisibles=false;
/** The exponent to which the doppler factor D is raised, to find changes in relative brightness. */
var brightnessExponent=2;
/** The distance in parsecs to the central source. */
var distance=11000;
/** Toggle off to see the end-state of the animation. */
var anim=true;
/** The time according to the detector's wristwatch. */
var currentDetectorTime=0;

/** Recycles every N seconds, to restart the animation. */
function animationTime(){
  return anim ? secondsFromStart() % TOTAL_TIME : TOTAL_TIME;
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

/** Absorb the latest user entries for controlling the display. */
function applyUserInput(
  userBeta,userTheta,userBrightness,userBrightnessLimit,
  userShowInvisibles,userBrightnessExponent,userDistance,userAnim
){
  startTime = millis(); 
  beta=userBeta;
  theta=radians(userTheta);
  brightness=userBrightness;
  brightnessLimit=userBrightnessLimit;
  showInvisibles=userShowInvisibles;
  brightnessExponent=userBrightnessExponent;
  distance=userDistance;
  anim=userAnim;
}

/**  
 Draw the motion of the given jet, with the given theta.
 Also draw with a set of canned values for theta, 
 to show how the behavior changes for various angles of view.
*/
function drawCanvas(ctx){
  defaultStyles(ctx);
  background(ctx);
  drawStaticParts(ctx);
  currentDetectorTime=animationTime();
  drawChangingParts(ctx);
}

function defaultStyles(ctx){
  ctx.fillStyle = BASE_COLOR; 
  ctx.strokeStyle = BASE_COLOR;
  myFont(ctx);
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
  text(ctx,"\u03B2 "+beta,10,10);
  text(ctx,"\u03B8 "+round(degrees(theta),2) + "\u00B0",60,10);
  var btpeak=apparentVelocityTransverseMax(beta);
  text(ctx,"Peak apparent speed",10,30);
  text(ctx,round(btpeak.b,2) + "c at "+round(degrees(btpeak.theta),2) + "\u00B0",10,50);
    
  text(ctx,"\u0393 "+round(gamma(beta),2),630,10);
  text(ctx,"Neutral-D "+round(degrees(dopplerNeutralAngle(beta)),1) + "\u00B0",630,30);
  
  text(ctx,"Astrophysical Jets",WIDTH/2-55,10);
  
  var ypos=Y_START-ROW_HEIGHT;
  text(ctx,"\u03B8",COL_LEFT,ypos);
  text(ctx,"sp",COL_LEFT+1.2*COL_SPACE,ypos);
  text(ctx,"bri",COL_LEFT+2.2*COL_SPACE,ypos);
  
  text(ctx,"Light speed:",COL_LEFT+40,Y_START+1.0*ROW_HEIGHT,"rgb(255,255,255)");
  
  text(ctx,"\u03B8",COL_RIGHT,ypos);
  text(ctx,"sp",COL_RIGHT+1.2*COL_SPACE,ypos);
  text(ctx,"bri",COL_RIGHT+2.2*COL_SPACE,ypos);
  brightnessChart(ctx);
  angleChart(ctx);
}

function brightnessChart(ctx){
  text(ctx,"Brightness",COL_LEFT,SIZE_CHART_Y);
  brightnessChartItem(ctx,1,1);
  brightnessChartItem(ctx,2,10);
  brightnessChartItem(ctx,3,100);
  brightnessChartItem(ctx,4,1000);
}

function brightnessChartItem(ctx,idx,brightness){
  var ypos=SIZE_CHART_Y+idx*12+7;
  showBlob(ctx,COL_LEFT+3,ypos,brightness);
  text(ctx,brightness+"x",COL_LEFT+10,ypos);
}

/**  
 Small picture of the geometry of the angle theta, at the top. 
 This gives you a better feel for the 'actual' situation, the 'real' motion in space.
*/
function angleChart(ctx){
  var xpos=WIDTH/2;
  var ypos=50;
  var radius=20;
  
  circle(ctx,xpos,ypos,radius);
  spot(ctx,xpos,ypos,1);
  line(ctx,xpos,ypos,WIDTH/2,ypos+1.75*radius);
  arrowDown(ctx,xpos,ypos+1.75*radius);
  
  //radial lines showing theta
  line(ctx,xpos,ypos,xpos+Math.sin(theta)*radius,ypos+Math.cos(theta)*radius);
  ctx.save();
  ctx.fillStyle="rgb(255,255,255)";
  spot(ctx,xpos+Math.sin(theta)*radius,ypos+Math.cos(theta)*radius,1.5);
  ctx.restore();
  
  line(ctx,xpos,ypos,xpos-Math.sin(theta)*radius,ypos-Math.cos(theta)*radius);
  ctx.save();
  ctx.fillStyle="rgb(255,255,255)";
  spot(ctx,xpos-Math.sin(theta)*radius,ypos-Math.cos(theta)*radius,1.5);
  ctx.restore();

  //an arc showing theta
  ctx.beginPath();
  ctx.arc(xpos,ypos,radius*0.4,1.5,Math.PI/2-theta,true);
  ctx.stroke();
  ctx.closePath();
}

/**   
 The apparent transverse motion of the two jets.
 Top: for given theta.
 After: for N canned values of theta.
*/
function drawChangingParts(ctx){
  transverseMotionFor(ctx,theta,0,1);
  lightSpeedIndicator(ctx);
  for(var row=2; row<=10; ++row){ 
    var rads=radians(100-(row-1)*10); //90..10
    var angle = (theta<=Math.PI/2) ? rads : (Math.PI-rads);
    transverseMotionFor(ctx,angle,row,0); 
  }
}

/**
 Use the current detector time to show the positions of the two jets, offset 
 with respect to the central source.
*/
function transverseMotionFor(ctx,theta/*rads*/,row,numDecimalsTheta){
  var ypos=Y_START+row*ROW_HEIGHT;
  showBlob(ctx,SOURCE_X,ypos,1); //central source has unit brightness
  //the right hand blob uses theta directly
  drawBlob(ctx,theta,true,ypos,numDecimalsTheta);
  //the left hand blob uses the pi-complement of theta
  drawBlob(ctx,Math.PI-theta,false,ypos,numDecimalsTheta);
}

function lightSpeedIndicator(ctx){
  ctx.save();
  ctx.fillStyle="rgb(255,255,255)";
  ctx.strokeStyle="rgb(255,255,255)";
  var dx=1*currentDetectorTime*LIGHT_DAY;
  var ypos=Y_START+1.0*ROW_HEIGHT;
  var bar=4;
  line(ctx,SOURCE_X+dx,ypos-bar,SOURCE_X+dx,ypos+bar);
  line(ctx,SOURCE_X-dx,ypos-bar,SOURCE_X-dx,ypos+bar);
  ctx.restore();
}

/** 
 Draw a blob offset from the central source, with size indicating brightness.
 Text with related numbers off to the side. 
*/
function drawBlob(ctx,theta,isRightBlob,ypos,numDecimalsTheta){
  var b=apparentVelocity(beta,theta);
  var dx=b.t*currentDetectorTime*LIGHT_DAY;
  var xpos = isRightBlob  ? SOURCE_X+dx : SOURCE_X-dx;
  var dopp=doppler(beta,theta);
  var bright=brightness*Math.pow(dopp,brightnessExponent);
  var speed=round(b.t,2);  
  var angle=round(degrees(theta),numDecimalsTheta)+"\u00B0";
  var br=round(bright,2);
  if (isRightBlob){
    text(ctx,angle,COL_RIGHT,ypos);
    text(ctx,speed,COL_RIGHT+1.2*COL_SPACE,ypos);
    text(ctx,br,COL_RIGHT+2.2*COL_SPACE,ypos);
  }
  else {
    text(ctx,angle,COL_LEFT,ypos);
    text(ctx,speed,COL_LEFT+1.2*COL_SPACE,ypos);
    text(ctx,br,COL_LEFT+2.2*COL_SPACE,ypos);
  }
  if (bright>=brightnessLimit) {
    showBlob(ctx,xpos,ypos,bright);
  }
  else if (showInvisibles){
    showInvisible(ctx,xpos,ypos);
  }
}

function showBlob(ctx,xpos,ypos,bright){
  var bspot=blobSpot(bright);
  ctx.save();
  ctx.fillStyle=bspot.color;
  ctx.strokeStyle=bspot.color;
  spot(ctx,xpos,ypos,bspot.size);
  ctx.restore();
}

/** 
 Size and color for a blob. 
 The brightness range is very large, so the color is used to denote a rough
 'order of magnitude'. When the brightness gets large, the color changes from the 
 base color green to other colors. 
*/
function blobSpot(bright){
  var thecolor=BASE_COLOR;
  var thesize = bright*SIZE_UNIT_BRIGHTNESS;
  if (bright>=1000){
    thecolor="rgb(255,0,0)"; //red
    thesize=(bright/1000)*SIZE_UNIT_BRIGHTNESS;
  }
  else if (bright>=100){
    thecolor="rgb(255,100,100)"; //orange-y
    thesize=(bright/100)*SIZE_UNIT_BRIGHTNESS;
  }
  else if (bright>=10){
    thecolor="rgb(255,255,0)"; //yellow
    thesize=(bright/10)*SIZE_UNIT_BRIGHTNESS;
  }
  return {size:thesize,color:thecolor};
}

/** Tiny spot of a different color. */
function showInvisible(ctx,xpos,ypos){
  ctx.save();
  ctx.fillStyle=INVISIBLE_COLOR;
  spot(ctx,xpos,ypos,1);
  ctx.restore();
}
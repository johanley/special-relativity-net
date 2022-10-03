/**
 Circular diagram showing the aberration of light.
 
 Include neutral radius, half-sky radius, and indicate doppler factor.
 To avoid bunching, rays don't usually go all the way to the center.
 Rays are dotted, to indicate the numeric size of the doppler factor.
*/

//the coords assume 800*600
var WIDTH=800;
var HEIGHT=600;
var CTRX=WIDTH/2;
var CTRY=HEIGHT/2;
var RADIUS=0.45*HEIGHT;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR="rgb(0,255,0)";
var RED="rgb(242,153,153)";
var BLUE="rgb(166,233,255)";
var TOP=1.5*Math.PI;
var BOTTOM=0.5*Math.PI;
var NUM_DEGREES_PER_DIVISION=1;
var PERIMETER_WIDTH=20; 
var NEUTRAL_BASE_LENGTH=RADIUS/5;

var startTime = millis(); 
var TOTAL_TIME = 8; //seconds

/** Input from user. */
var maxBeta=0.60;
/** Num radial lines to use. */
var numRadialLines=8;
/** Relative size of radial lines. */
var sizeRadialLines=1;
/** The value of beta to use for the current animation. */
var currentBetaVal=0.6;
/** Show dots along the radial lines, to indicate the size of D. */
var showDopplerDots=false;
/** Whether or not to animate the graph. */
var anim=true;

/** Use the request param or user entry for the max value of beta to use. */
function applyUserInput(betaUser,numRadialLinesUser,sizeRadialLinesUser,showDopplerDotsUser,animUser){
  startTime=millis(); 
  maxBeta=betaUser;
  numRadialLines=numRadialLinesUser;
  sizeRadialLines=sizeRadialLinesUser;
  showDopplerDots=showDopplerDotsUser;
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

/** Center dot, and arrow pointing in the direction of motion. */
function drawStaticParts(ctx){
  var width=2;
  var height=10;
  ctx.beginPath();
  ctx.rect(CTRX-width,CTRY-height,width*2,height*2);
  ctx.stroke();
  ctx.fill();
  ctx.lineWidth=3;
  arrowUp(ctx,CTRX,CTRY-height-3);
  ctx.closePath();
  ctx.lineWidth=1;

  ctx.save();
  ctx.strokeStyle="black";
  ctx.fillStyle="black";
  spot(ctx,CTRX,CTRY,1);
  ctx.restore();
}

function drawChangingLines(ctx){
  headsUpDisplay(ctx);
  perimeter(ctx);
  scaleDivisions(ctx);
  scaleNumbers(ctx);
  halfSkyIndicator(ctx);
  radialLines(ctx);
}

/** The perimeter of the circle, in red and blue.*/
function perimeter(ctx){
  var neutralAngle=dopplerNeutralAngle(currentBetaVal);
  ctx.save();
  ctx.strokeStyle=BLUE;
  ctx.lineWidth=PERIMETER_WIDTH;
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,RADIUS,TOP+neutralAngle,TOP-neutralAngle,true);//blue
  ctx.stroke();
  ctx.closePath();
  
  ctx.strokeStyle=RED;
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,RADIUS,TOP+neutralAngle,TOP-neutralAngle,false);//blue
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/** Degree markings. */
function scaleDivisions(ctx){
  //add the divisions, to measure degrees on the perimeter
  ctx.save();
  ctx.strokeStyle='black';
  ctx.lineWidth=1;
  var steprads = radians(NUM_DEGREES_PER_DIVISION);
  for (var idx=0; idx<(360/NUM_DEGREES_PER_DIVISION); ++idx){
    var rads=steprads*idx;
    var point1=perimeterPoint(CTRX,CTRY,RADIUS-10,rads); 
    var diff=10;
    if (idx%10==0){
      diff=20;
    }
    else if (idx%5==0){
      diff=15;
    }
    var point2=perimeterPoint(CTRX,CTRY,RADIUS-10+diff,rads); 
    line(ctx,point1.x,point1.y,point2.x,point2.y);
  }
  ctx.restore();
}

function scaleNumbers(ctx){
  ctx.save();
  myFont(ctx);
  var steprads = radians(NUM_DEGREES_PER_DIVISION*10);
  for (var idx=0; idx<(360/(NUM_DEGREES_PER_DIVISION*10)); ++idx){
    var rads=steprads*idx;
    var point=perimeterPoint(CTRX,CTRY,RADIUS+20,rads); 
    var number=((idx*10) + 90)%360; //right half of the circle
    if (number>180){
      //recalc for the left half of the circle
      number=360-number;
    }
    var adjustedPoint=adjustTextPosition(ctx,point,rads,number);
    text(ctx,number,adjustedPoint.x,adjustedPoint.y);
    //spot(ctx,point.x,point.y,1);
  }
  ctx.restore();
}

/** Hacky tweaks to account for variation of text position relative to the perimeter. */
function adjustTextPosition(ctx,point,angle,number){
  var textwidth = ctx.measureText(number).width;
  var result={};
  var tweakx=0;
  var tweaky=0;
  var tweak=3;
  if (angle>=1.5*Math.PI || angle<=0.5*Math.PI){
    //right half
    tweaky=1.5*tweak;
    tweakx=-textwidth/2.5;
  }
  else {
    //left half
    tweaky=2*tweak;
    tweakx=-textwidth/1.7;
  }
  result.x=point.x+tweakx;
  result.y=point.y+tweaky;
  return result;
}

/** A little radial line outside the perimeter of the circle, one on each side, plus a wee dot. */
function halfSkyIndicator(ctx){
  ctx.save();
  ctx.strokeStyle=BACKGROUND;
  var halfSkyAngle=aberrationHalfSky(currentBetaVal);
  halfSkyIndicatorFor(ctx,halfSkyAngle);
  halfSkyIndicatorFor(ctx,-halfSkyAngle);
  ctx.restore();
}

function halfSkyIndicatorFor(ctx,angle){
  var halfSkyPoint1=perimeterPoint(CTRX,CTRY,RADIUS+PERIMETER_WIDTH/2,TOP+angle); 
  var halfSkyPoint2=perimeterPoint(CTRX,CTRY,RADIUS-PERIMETER_WIDTH/2,TOP+angle); 
  line(ctx,halfSkyPoint1.x,halfSkyPoint1.y,halfSkyPoint2.x,halfSkyPoint2.y);
  var halfSkyPoint3=perimeterPoint(CTRX,CTRY,RADIUS+PERIMETER_WIDTH/2+2,TOP+angle); 
  spot(ctx,halfSkyPoint3.x,halfSkyPoint3.y,2);
}

/** Translate an angle to a point on the circumference. */
function perimeterPoint(ctrx,ctry,radius,angle/*positive downwards from right*/){
  var result={};
  result.x=ctrx+Math.cos(angle)*radius;
  result.y=ctry+Math.sin(angle)*radius;
  return result;
}

/** Translate an angle to a point on the circumference. */
function perimeterPoint2(ctrx,ctry,radius,angle/*positive downwards from top*/){
  var result={};
  result.x=CTRX+Math.sin(angle)*radius;
  result.y=CTRY-Math.cos(angle)*radius;
  return result;
}

function radialLines(ctx){
  var neutralAngle=dopplerNeutralAngle(Math.abs(currentBetaVal));
  var neutralLength=unitLength();
  var outerRadius = RADIUS-PERIMETER_WIDTH/2;
  var steprads = (2*Math.PI)/numRadialLines;
  //do a half cycle, and reflect about the verticial axis of symmetry
  for (var idx=0; idx<=numRadialLines/2; ++idx){
    var rads=steprads*idx;
    //convert angle using aberration formula
    var angleFromTop=aberrationDecr(rads,currentBetaVal);
    //set the color according to the neutral angle
    var color=angleFromTop > neutralAngle ? RED : BLUE;
    //find two perim points, at two radii
    var perimA=perimeterPoint2(CTRX,CTRY,outerRadius,angleFromTop);
    var dopplerVal=doppler(currentBetaVal,angleFromTop); //aberration first, doppler second! important
    var innerRadius=outerRadius-dopplerVal*neutralLength;
    var perimB=perimeterPoint2(CTRX,CTRY,innerRadius,angleFromTop);
    ctx.save();
    ctx.strokeStyle=color;
    line(ctx,perimA.x,perimA.y,perimB.x,perimB.y);
    line(ctx,CTRX-(perimA.x-CTRX),perimA.y,CTRX-(perimB.x-CTRX),perimB.y);
    ctx.restore();
    if(showDopplerDots){
      addDopplerDots(ctx,angleFromTop,outerRadius,innerRadius);
    }
  }
}

function unitLength(){
  return NEUTRAL_BASE_LENGTH/sizeRadialLines;
}

/** Add dots along radial lines, to allow a visual determinatior of D. */
function addDopplerDots(ctx,angleFromTop,outerRadius,innerRadius){
  ctx.save();
  ctx.strokeStyle="rgb(0,0,0)";
  ctx.fillStyle="rgb(0,0,0)";
  var decrementRadius=unitLength();
  var currentRadius=outerRadius-decrementRadius;
  while (currentRadius>innerRadius){
    var point=perimeterPoint2(CTRX,CTRY,currentRadius,angleFromTop);
    spot(ctx,point.x,point.y,1);
    spot(ctx,CTRX-(point.x-CTRX),point.y,1); //other side, reflect about vertical axis in the middle
    currentRadius=currentRadius-decrementRadius;
  }
  ctx.restore();
}

function doppler1(theta){
  return doppler(currentBetaVal,theta);
}

/** Display some important numbers as name-value pairs. */
function headsUpDisplay(ctx){
  var headsUpY=0.75*HEIGHT;
  var headsUpX=0.01*WIDTH;
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
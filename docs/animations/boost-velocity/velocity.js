/**
 Circular diagram showing the transformation of velocity.
 
 Each animation includes N different velocity vectors, at N different theta angles =
 with respect to the x-axis. These are boosted from 0 to the given beta.
*/

//the coords assume 800*600
var WIDTH=800;
var HEIGHT=600;
var CTRX=WIDTH/2;
var CTRY=HEIGHT/2;
var RADIUS=0.45*HEIGHT;

var BACKGROUND = "rgb(13,66,18)"; 
var BASE_COLOR="rgb(0,255,0)";
var NUM_DEGREES_PER_DIVISION=1;
var PERIMETER_WIDTH=20; 
var SPOT_SIZE=1;

var startTime = millis(); 
var TOTAL_TIME = 8; //seconds

/** Speed of the object in the unprimed system. */
var speed=0.50;
/** Input from user. */
var maxBeta=0.60;
/** Num different velocity angles to use. */
var numAngles=8;
/** The value of beta to use for the current animation. */
var currentBetaVal=0.6;
/** Whether or not to animate the graph. */
var anim=true;

/** Use the request param or user entry for the max value of beta to use. */
function applyUserInput(speedUser,betaUser,numAnglesUser,animUser){
  startTime=millis(); 
  speed=speedUser;
  maxBeta=betaUser;
  numAngles=numAnglesUser;
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

function drawStaticParts(ctx){
  centerAxes(ctx);
  perimeter(ctx);
  scaleDivisions(ctx);
  scaleNumbers(ctx);
}

/** Center dot, and axes for Vx and Vy. */
function centerAxes(ctx){
  spot(ctx,CTRX,CTRY,2);
  var AXIS_LENGTH=20;
  ctx.save();
  ctx.font = '12px sans-serif';
  
  line(ctx,CTRX,CTRY+AXIS_LENGTH,CTRX,CTRY-AXIS_LENGTH); //beta-x
  text(ctx,"\u03B2x",CTRX-7,CTRY-AXIS_LENGTH-7);
  arrowUp(ctx,CTRX,CTRY-AXIS_LENGTH);
  
  line(ctx,CTRX-AXIS_LENGTH,CTRY,CTRX+AXIS_LENGTH,CTRY); //beta-y
  arrowLeft(ctx,CTRX-AXIS_LENGTH,CTRY)
  text(ctx,"\u03B2y",CTRX-AXIS_LENGTH-18,CTRY+3);
  ctx.restore();  
}

function drawChangingLines(ctx){
  headsUpDisplay(ctx);
  velocityVectors(ctx);
  //radialLines(ctx);
}

/** The perimeter of the circle. */
function perimeter(ctx){
  ctx.save();
  //ctx.strokeStyle=BLUE;
  ctx.lineWidth=PERIMETER_WIDTH;
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,RADIUS,0,2*Math.PI,true);
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
  ctx.font='12px sans-serif';
  var steprads = radians(NUM_DEGREES_PER_DIVISION*10);
  for (var idx=0; idx<(360/(NUM_DEGREES_PER_DIVISION*10)); ++idx){
    var rads=steprads*idx;
    var point=perimeterPoint(CTRX,CTRY,RADIUS+20,rads); 
    var number=360-((idx*10) + 90)%360; 
    number = number % 360;
    var adjustedPoint=adjustTextPosition(ctx,point,rads,number);
    text(ctx,number,adjustedPoint.x,adjustedPoint.y);
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

/** Translate an angle to a point on the circumference. */
function perimeterPoint3(ctrx,ctry,radius,angle/*0 at top, positive to the left*/){
  var result={};
  result.x=CTRX-Math.cos(angle)*radius;
  result.y=CTRY-Math.sin(angle)*radius;
  return result;
}

/** 
 Show N velocity vectors, boosted into the grid moving at speed beta.
 Initially, the N vectors have the same magnitude, and equally spaced directions.
 As beta increases from 0, the vectors change magnitude and direction.
*/
function velocityVectors(ctx){
  var lightRadius = RADIUS-PERIMETER_WIDTH/2;
  var unprimedRadius = speed*lightRadius;
  var steprads = (2*Math.PI)/numAngles;
  //console.log("unprimed radius" + unprimedRadius);
  //console.log("steprads" + steprads);
  //console.log("numangles" + numAngles);
  for (var idx=0; idx<=numAngles; ++idx){
    var rads=steprads*idx;
	
	//unprimed vectors - N vectors of the same speed, in  N directions
    var perimA=perimeterPoint3(CTRX,CTRY,unprimedRadius,rads);
    //console.log("perimA x" + perimA.x + " y:" + perimA.y);
	spot(ctx,perimA.x,perimA.y,SPOT_SIZE);
	
	//primed vectors - boost the unprimed
	var betax=speed*Math.cos(rads);
	var betay=speed*Math.sin(rads);
	var prime=boostVelocity(currentBetaVal,betax,betay,0);
	ctx.save();
	ctx.strokeStyle="white";
	ctx.fillStyle="white";
	//the v-axes are the opposite of the canvas coords
	spot(ctx,CTRX-(prime.betayp*lightRadius),CTRY-(prime.betaxp*lightRadius),SPOT_SIZE);
	ctx.restore();
    //join the old to the new?????
  }
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
    var dopplerVal=doppler(currentBetaVal,angleFromTop);
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

function doppler1(theta){
  return doppler(currentBetaVal,theta);
}

/** Display some important numbers as name-value pairs. */
function headsUpDisplay(ctx){
  var headsUpY=0.10*HEIGHT;
  var headsUpX=0.05*WIDTH;
  var SPACING=20;
  ctx.save();
  ctx.font = "20px Times New Roman";
  text(ctx,"\u03B2 = "+round(currentBetaVal,2),headsUpX,headsUpY);
  text(ctx,"\u03B3 = "+round(gamma(currentBetaVal),2),headsUpX,headsUpY+SPACING*1);
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
/**
 Simple 2D chart, showing how the apparent velocity changes with angle,
 as beta increases from 0 to 1.
*/

//the coords assume 800*600
var XSTART = 40;
var XEND = 760;
var XWIDTH = XEND-XSTART;
var XSTEP = XWIDTH/180;
var XMIDDLE = XSTART+(XEND-XSTART)/2;

var YEND = 550;
var YSTART = 10;
var YHEIGHT = YEND-YSTART;
var NUM_VERTICAL_DIVISIONS=4;
var YSTEP = YHEIGHT/NUM_VERTICAL_DIVISIONS;
var YMIDDLE = YSTART+(YEND-YSTART)/2;

var STEP_SIZE=Math.PI/180;

var TEXT_COLOR = "rgb(0,255,0)";
var BACKGROUND = "rgb(13,66,18)"; 
var TRANSVERSE_COLOR = "rgb(255,255,255)";
var RADIAL_COLOR = TEXT_COLOR;

var startTime = millis(); 
var TOTAL_TIME = 8; //seconds

/** Input from user. */
var maxBeta=0.60;
/** The value of beta to use for the current animation. */
var currentBetaVal;
/** Whether or not to animate the graph. */
var anim=true;

/** Use the request params to change internal state. */
function applyUserInput(betaUser, animUser){
  startTime=millis(); 
  maxBeta=betaUser;
  anim=animUser;
}

/** Draw the canvas, using the num seconds since the start of the animation. */
function drawCanvas(ctx){
  styles(ctx);
  ctx.save();
  drawStaticParts(ctx);
  currentBetaVal=currentBeta();
  drawChangingLines(ctx);
  ctx.restore();
}

function styles(ctx){
  myFont(ctx);
  ctx.strokeStyle=TEXT_COLOR;
  ctx.fillStyle=TEXT_COLOR;
}

/** Axes. */
function drawStaticParts(ctx){
  rect(ctx,0,0,800,600,BACKGROUND);

  text(ctx,"b",12,YMIDDLE+71);
  text(ctx,"\u03B8",XEND+15,YEND+5);
  
  line(ctx,XSTART,YEND+5,XSTART,YSTART); //D axis, left
  line(ctx,XEND,YEND+5,XEND,YSTART); //D axis, right
  line(ctx,XSTART-5,YEND,XEND,YEND); //theta axis
  tickMarkVertical(ctx,XMIDDLE,YEND,3);
  line(ctx,XMIDDLE,YEND,XMIDDLE,YSTART);
  tickMarkVertical(ctx,XEND,YEND,3);
  
  //vertical axis - left and right
  var SMALL_Y_STEP=YSTEP/10;
  for (var idx=0; idx<=NUM_VERTICAL_DIVISIONS*10; ++idx){
    var ypos=YEND-idx*SMALL_Y_STEP;
    var tickSize = (idx%5==0) ? 6 : 3;
    tickMarkHorizontal(ctx,XSTART,ypos,tickSize);
    tickMarkHorizontal(ctx,XEND,ypos,tickSize);
    if (idx%10 == 0){
      var xpos = idx > 0 ? XSTART-15 : XSTART-19;
      text(ctx,idx/10-1,xpos,ypos+5);
    }
    if (idx==10){
      line(ctx,XSTART,ypos,XEND,ypos); //line for b=0,1
    }
  }
  
  //horizontal axis, every 5 degrees, 0..180
  text(ctx,"Approaching",XSTART+135,YEND+37);
  text(ctx,"Receding",XEND-190,YEND+37);
  text(ctx,"Transverse",XMIDDLE-30,YEND+37);
  ctx.save();
  ctx.font = '10px sans-serif';
  for (var idx=1; idx<=36; ++idx){
    var xpos=XSTART+idx*XSTEP*5;
    var tickSize = (idx%2==0) ? 6 : 3;
    tickMarkVertical(ctx,xpos,YEND,tickSize);
    if (idx%2==0){
      text(ctx,(5*idx)+"\u00B0",xpos-10,YEND+18);
    }
  }
  ctx.restore();
}

/** 
 The curve for the apparent velocity, and the 'heads-up display'
 of related numbers, in the top left corner.
*/
function drawChangingLines(ctx){
  ctx.save();
  ctx.strokeStyle=TRANSVERSE_COLOR;
  graphFnXWithScale(ctx,apparentVelocityTransverse,
    XSTART/*ctrx*/,YEND/*ctry*/,
    0/*startx*/,Math.PI/*endx*/,STEP_SIZE/*1 degree*/,
    XWIDTH/Math.PI/*scalex*/,YHEIGHT/NUM_VERTICAL_DIVISIONS/*scaley*/
  );
  ctx.restore();
  ctx.save();
  ctx.strokeStyle=RADIAL_COLOR;
  graphFnXWithScale(ctx,apparentVelocityRadial,
    XSTART/*ctrx*/,YEND/*ctry*/,
    0/*startx*/,Math.PI/*endx*/,STEP_SIZE/*1 degree*/,
    XWIDTH/Math.PI/*scalex*/,YHEIGHT/NUM_VERTICAL_DIVISIONS/*scaley*/
  );
  ctx.restore();
  headsUpDisplay(ctx);
}

/** Adds 1 to the physics formula, to allow graphing of negative values. */
function apparentVelocityTransverse(theta){
  var b = apparentVelocity(currentBetaVal,theta);
  return b.t + 1;
}

/** Adds 1 to the physics formula, to allow graphing of negative values. */
function apparentVelocityRadial(theta){
  var b = apparentVelocity(currentBetaVal,theta);
  return b.r + 1;
}

/** Display some important numbers as name-value pairs. */
function headsUpDisplay(ctx){
  ctx.save();
  myBigFont(ctx);
  var headsUpY=YSTART;
  var headsUpX=XEND-240;
  var SPACING=20;
  var max=apparentVelocityTransverseMax(currentBetaVal);
  ctx.save();
  ctx.font = "20px Times New Roman";
  text(ctx,"\u03B2 "+round(currentBetaVal,2),headsUpX,headsUpY+SPACING*1);
  text(ctx,"\u03B3 "+round(gamma(currentBetaVal),2),headsUpX,headsUpY+SPACING*2);
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle=TRANSVERSE_COLOR;
  text(ctx,"Transverse Velocity",headsUpX,headsUpY+SPACING*4);
  text(ctx,"Peak b "+round(max.b,2),headsUpX,headsUpY+SPACING*5);
  text(ctx,"Peak theta "+round(degrees(max.theta),2)+"\u00B0",headsUpX,headsUpY+SPACING*6);
  text(ctx,"90\u00B0 val "+round(apparentVelocity(currentBetaVal,Math.PI/2).t,2),headsUpX,headsUpY+SPACING*7);
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle=RADIAL_COLOR;
  text(ctx,"Radial Velocity",headsUpX,headsUpY+SPACING*9);
  text(ctx,"0\u00B0 val "+round(apparentVelocity(currentBetaVal,0).r,2),headsUpX,headsUpY+SPACING*10);
  text(ctx,"180\u00B0 val "+round(apparentVelocity(currentBetaVal,Math.PI).r,2),headsUpX,headsUpY+SPACING*11);
  ctx.restore();

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
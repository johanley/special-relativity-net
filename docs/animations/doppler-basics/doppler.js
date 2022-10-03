/**
 Simple 2D chart, showing how the Doppler factor changes with angle,
 as beta increases from 0 to 1.
*/

//the coords assume 800*600
var XSTART = 20;
var XEND = 760;
var XWIDTH = XEND-XSTART;
var XSTEP = XWIDTH/180;
var XMIDDLE = XSTART+(XEND-XSTART)/2;

//var yend = 570;
var YEND = 550;
var YSTART = 10;
var YHEIGHT = YEND-YSTART;
var NUM_VERTICAL_DIVISIONS=4;
var YSTEP = YHEIGHT/NUM_VERTICAL_DIVISIONS;
var YMIDDLE = YSTART+(YEND-YSTART)/2;

var RED="rgb(242,153,153)";
var BLUE="rgb(166,233,255)";

var STEP_SIZE=Math.PI/180;

var startTime = millis(); 
var TOTAL_TIME = 8; //seconds

/** Input from user. */
var maxBeta=0.60;
/** The value of beta to use for the current animation. */
var currentBetaVal;
/** The exponent to which D is raised. */
var power=1;
/** Whether or not to animate the graph. */
var anim=true;
/** 
 The special, specific angle to show in the heads-up display.
 Indicated by the user clicking on the canvas.
 This data is shown only if the animation is stopped.
*/
var specialAngle=0;

/** Use the request param or user entry for the max value of beta to use. */
function applyUserInput(betaUser, animUser, powerUser){
  startTime=millis(); 
  maxBeta=betaUser;
  anim=animUser;
  power=powerUser;
}

/** 
 React to the user clicking on the canvas, to show the corresponding theta and D. 
 This has an effect only when the diagram is NOT being animated.
*/
function applyMousePosition(mousePosition){
  if (XSTART<=mousePosition.x && mousePosition.x<=XEND){
    specialAngle = Math.PI * (mousePosition.x - XSTART)/XWIDTH;
  }
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
}

/** Curves showing D as a function of angle, for various values of beta.*/
function drawStaticParts(ctx){
  //red area
  rect(ctx,XSTART,YEND-YSTEP,XEND-XSTART,YSTEP,RED);
  //blue area
  rect(ctx,XSTART,YSTART,XEND-XSTART,YEND-YSTEP-YSTART,BLUE);
  
  text(ctx,"D",0,YMIDDLE+71);
  text(ctx,"Blueshift",XSTART+10,YEND-145);
  text(ctx,"Redshift",XSTART+10,YEND-117);
  text(ctx,"\u03B8",XEND+15,YEND+5);
  
  line(ctx,XSTART,YEND+5,XSTART,YSTART); //D axis, left
  line(ctx,XEND,YEND+5,XEND,YSTART); //D axis, right
  line(ctx,XSTART-5,YEND,XEND,YEND); //theta axis
  tickMarkVertical(ctx,XMIDDLE,YEND,3);
  line(ctx,XMIDDLE,YEND,XMIDDLE,YSTART);
  tickMarkVertical(ctx,XEND,YEND,3);
  
  //vertical axis - left and right
  var SMALL_Y_STEP=YSTEP/10;
  for (var idx=1; idx<=NUM_VERTICAL_DIVISIONS*10; ++idx){
    var ypos=YEND-idx*SMALL_Y_STEP;
    var tickSize = (idx%5==0) ? 6 : 3;
    tickMarkHorizontal(ctx,XSTART,ypos,tickSize);
    tickMarkHorizontal(ctx,XEND,ypos,tickSize);
    if (idx%10 == 0){
      text(ctx,idx/10,XSTART-15,ypos+5);
      text(ctx,idx/10,XEND+15,ypos+5);
    }
    if (idx==10){
      line(ctx,XSTART,ypos,XEND,ypos); //line for D=1
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
      text(ctx,(5*idx)+"\u00B0",xpos-10,YEND+17);
    }
  }
  ctx.restore();
}

/** 
 The curve for the doppler factor, and the 'heads-up display'
 of related numbers, in the top left corner.
*/
function drawChangingLines(ctx){
  graphFnXWithScale(ctx,doppler1,
    XSTART/*ctrx*/,YEND/*ctry*/,
    0/*startx*/,Math.PI/*endx*/,STEP_SIZE/*1 degree*/,
    XWIDTH/Math.PI/*scalex*/,YHEIGHT/NUM_VERTICAL_DIVISIONS/*scaley*/
  );
  headsUpDisplay(ctx);
}

function doppler1(theta){
  var base = doppler(currentBetaVal,theta);
  return Math.pow(base,power);
}

/** Display some important numbers as name-value pairs. */
function headsUpDisplay(ctx){
  ctx.save();
  ctx.font = '16px sans-serif';
  var headsUpY=YSTART+200;
  var headsUpX=XEND-240;
  var SPACING=20;

  ctx.save();
  ctx.font = "20px Times New Roman";
  text(ctx,"\u03B2 = "+round(currentBetaVal,2),headsUpX,headsUpY+SPACING*2);
  text(ctx,"0\u00B0 val = "+round(doppler1(0),2),headsUpX,headsUpY+SPACING*3);
  text(ctx,"90\u00B0 val = "+round(doppler1(Math.PI/2),2),headsUpX,headsUpY+SPACING*4);
  text(ctx,"180\u00B0 val = "+round(doppler1(Math.PI),2),headsUpX,headsUpY+SPACING*5);
  text(ctx,"Neutral Angle = " + round(degrees(dopplerNeutralAngle(Math.abs(currentBetaVal))),2) + "\u00B0",headsUpX,headsUpY+SPACING*6);
  text(ctx,"\u03B3 = "+round(gamma(currentBetaVal),2),headsUpX,headsUpY+SPACING*7);
  if(!anim && specialAngle>0){
    text(ctx,round(degrees(specialAngle),2)+"\u00B0 val = " + round(doppler1(specialAngle),2),headsUpX,headsUpY+SPACING*8);
  }
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
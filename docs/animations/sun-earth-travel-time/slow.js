/**
 A photon travelling from the sun to the earth.
 Simple demonstration of how slow light is when the distances are astronomical. 
 
 The travel time of a theoretical photon going from the center of the sun 
 to the center of the earth varies by 16.6s during the year:
   min  490.7s (perihelion)
   max  507.3s (aphelion)
   mean 499.0s
 The mean travel time from the center of the sun's apparent disk to the surface of 
 the earth is 499.0 - 2.32 - 0.02 = 496.7s. This simulation rounds that number, and
 uses 497 pixels to represent the distance; it draws a line at a rate of 
 one pixel per second.
 
 Interesting: a photon takes 4.64s to go a distance equal to the sun's diameter.
*/

/** Must match the canvas. */
var WIDTH = 700;
var HEIGHT = 200;

var SUN_EARTH_LINE=HEIGHT/2;
var SUN_EARTH_DISTANCE=497; //from the nearest point on the sun's disk

var SUN_X = 100;
var EARTH_X = SUN_X + SUN_EARTH_DISTANCE;

var startTime = millis(); 

/** Draw the canvas, using the num seconds since the start to change the photon's position. */
function drawCanvas(ctx){
  myFont(ctx);
  ctx.fillStyle = 'rgb(255,255,255)'; 
  ctx.strokeStyle = 'rgb(255,255,255)';
  ctx.save();
  ctx.fillStyle = 'rgb(100,100,100)'; 
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.restore();
  drawSunAndEarth(ctx);
  drawPhoton(ctx);
  drawElapsedSeconds(ctx);
}

function drawSunAndEarth(ctx){
  spot(ctx,SUN_X-3,SUN_EARTH_LINE,2);
  text(ctx,"Sun",SUN_X-15,SUN_EARTH_LINE+20);
  spot(ctx,EARTH_X,SUN_EARTH_LINE,1);
  text(ctx,"Earth",EARTH_X-15,SUN_EARTH_LINE+20);
}

/** The photon position is updated once per second. */
function drawPhoton(ctx){
  ctx.save();
  ctx.strokeStyle = 'rgb(255,255,000)'; 
  ctx.lineWidth = 3;
  var photonX = SUN_X + secondsFromStart() % SUN_EARTH_DISTANCE;
  line(ctx,SUN_X,SUN_EARTH_LINE,photonX,SUN_EARTH_LINE);
  ctx.restore();
}

function drawElapsedSeconds(ctx){
  text(ctx,Math.round(secondsFromStart() % SUN_EARTH_DISTANCE) + "s", 180, SUN_EARTH_LINE + 80);
}

/** The current system time in millis. */
function millis(){
 return (new Date()).getTime();
}

function secondsFromStart(){
  var now = millis();
  return (now-startTime)/1000;
}
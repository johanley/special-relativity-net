/**
 How the stars appear to a human eye, travelling in a spacecraft.
 
 The ROUGH approximation is made of treating a star's radiation 
 as a simple blackbody spectrum. The corresponding temperature T is manually 
 mapped to a color, shown on screen.
 
 The brightness of a star here corresponds to the size of the dot on screen.
 The change in brightness is done using the approximate formula stated in McKinley/Doherty:
 American Journal of Physics, 47, 309 (1979)
 This formula is based on blackbody radiation, and point-like sources.
 
 No modelling is done here for the size of the star's disk, or its 
 orientation (Terrell rotation).  No modeling is done for reddening from interstellar dust.
 The stars are taken as having 0 velocity in the beta=0 grid.
 No modelling is done for binary stars, or multiple-star systems, clusters, or nebulae.
 No modelling is done for galaxies, or the Milky Way. SHOULD THAT BE ADDED, SINCE THEY HAVE D^4?
*/

//the coords assume 800*600
var WIDTH=800;
var HEIGHT=600;
var CTRX=WIDTH/2;
var CTRY=HEIGHT/2;
var RADIUS=0.45*HEIGHT;

var BACKGROUND = "rgb(50,50,50)"; 
var BASE_COLOR="rgb(0,255,0)";
var PERIMETER_WIDTH=10; 
var SPOT_SIZE=1;
var RADIUS_IN_SPACE=10; //parsecs
var VOLUME_OF_SPACE=1.3333*Math.PI*Math.pow(RADIUS_IN_SPACE,3); //cubic parsecs, volume of a sphere
var HEADS_UP_Y=0.03*HEIGHT;
var HEADS_UP_X=0.01*WIDTH;
var HEADS_UP_SPACING=20;
var HEADS_UP_Y_STARS=0.88*HEIGHT-20;
var MAP_SCALE=100;

var startTime = millis(); 

/** For an animation, the total time to gradually increase from beta=0 to maxBeta. */
var runningTime=8; //seconds
/** Input from user. */
var maxBeta=0.60;
/** The value of beta to use for the current animation. */
var currentBetaVal=0.6;
/** Whether or not to animate the graph. */
var anim=true;
/** Number of stars per cubic parsec. Globular cluster ~500 times that of the solar neighbourhood. */
var averageStellarDensity=0.11; 
/** The dimmest magnitude displayed to the user. */
var limitingMag=5.0;
/** Whether or not to show the half-sky and neutral radii. */
var showRadii=false;
/** Use blackbody colors when drawing stars. Otherwise draw all stars as white. */
var showColor=true;
/** Allow circles to be used to show stars. Otherwise render as rectangles. */
var circles=true;
/** 
 The stars seen in the animation. Must be populated only once per load. 
 The state of all stars is calculated first, then the canvas is updated at the end.
*/
var stars;
/** How the stars are to be created. */
var starPopulationName="nearbyAndRandom";
/** Has initialize the above 'stars' data stucture. */
var hasPopulatedTheStars=false;
/** Name of the projection used to generate x,y coords from r-theta-phi. */
var projectionName="stereographic";

function currentBeta(){
  var result = maxBeta;
  if (anim){
    var betaAnim = animationTime()/runningTime * maxBeta;
    result=betaAnim;
  }
  return result;
}

/** Recycles every N seconds, to restart the animation. */
function animationTime(){
  var result=secondsFromStart() % runningTime;
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

/** Use the request param or user entry for the max value of beta to use. */
function applyUserInput(
  betaUser,showRadiiUser,showColorUser,circlesUser,avgStellarDensityUser,
  limitingMagUser, projectionNameUser,starPopulationNameUser,animUser,runningTimeUser
){
  startTime=millis(); 
  maxBeta=betaUser;
  showRadii=showRadiiUser;
  showColor=showColorUser;
  circles=circlesUser;
  averageStellarDensity=avgStellarDensityUser;
  limitingMag=limitingMagUser;
  projectionName=projectionNameUser;
  starPopulationName=starPopulationNameUser;
  anim=animUser;
  runningTime=runningTimeUser;
}

/** Draw the canvas. */
function drawCanvas(ctx){
  styles(ctx);
  background(ctx);
  ctx.save();
  drawStaticParts(ctx);
  currentBetaVal=currentBeta(); //must set a fixed val of beta for each frame
  if (!hasPopulatedTheStars){
    stars=generateStarsFromSelectedPopulation();
    hasPopulatedTheStars=true;
  }
  drawChangingLines(ctx);
  ctx.restore();
}

function styles(ctx){
  //ctx.font = '16px sans-serif';
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

/** A border to the star map. */
function drawStaticParts(ctx){
  var d=4;
  //line(ctx,CTRX-d,CTRY,CTRX+d,CTRY);
  //line(ctx,CTRX,CTRY-d,CTRX,CTRY+d);
  border(ctx);
}

/** Perimeter around the star map. */
function border(ctx){
  if (projectionName=="stereographic" || projectionName=="mckinley"){
    perimeter(ctx);
  }
  else if ("equirectangular"==projectionName || projectionName=="behrmann"){
    box(ctx);
  }
  else if ("hammer"==projectionName){
    ellipseOutline(ctx);
  }
}

/** Circular perimeter for the star map. */
function perimeter(ctx){
  ctx.save();
  ctx.lineWidth=1;
  var halfSkyOrigCoords=projection(Math.PI/2,0);
  circle(ctx,CTRX,CTRY,halfSkyOrigCoords.x-CTRX);
  ctx.strokeStyle="rgb(202,215,255)";
  ctx.restore();
}

/** Rectangular perimeter for the star map. */
function box(ctx){
  var upper;
  var lower;
  if ("equirectangular"==projectionName){
    upper=equiRectangularProjection(+Math.PI/2,-Math.PI);
    lower=equiRectangularProjection(-Math.PI/2,+Math.PI);
  }
  else if ("behrmann"==projectionName){
    upper=behrmannProjection(+Math.PI/2,-Math.PI);
    lower=behrmannProjection(-Math.PI/2,+Math.PI);
  }
  rectUnfilled(ctx,upper.x,upper.y,lower.x-upper.x,lower.y-upper.y,BASE_COLOR);
}

/** Elliptical perimeter for the star map. */
function ellipseOutline(ctx){
  ctx.save();
  ctx.scale(1, 0.5); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(CTRX,2*CTRY,3.44*MAP_SCALE,0,2*Math.PI,false); //the size is just by trial and error
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); 
}

/** 
 Draw all dynamic parts of the canvas. 
 First update all state, then render the new state to the canvas.
*/
function drawChangingLines(ctx){
  var starSummary = updatePropertiesAllStars();
  headsUpDisplay(ctx,starSummary);
  magnitudeChart(ctx);
  colorChart(ctx);
  //ctx.translate(-3*CTRX,-3*CTRY);
  //ctx.scale(4,4);
  renderStars(ctx); 
  if (showRadii){
    showHalfSkyAndNeutral(ctx);
  }
}

/** Display some important information, usually as name-value pairs. */
function headsUpDisplay(ctx,starSummary){
  var betaRounding = (currentBetaVal > 0.99 ? 9 : 2);
  text(ctx,"\u03B2 "+round(currentBetaVal,betaRounding),HEADS_UP_X,HEADS_UP_Y);
  text(ctx,"\u0393 "+round(gamma(currentBetaVal),2),HEADS_UP_X,HEADS_UP_Y+HEADS_UP_SPACING*1);
  text(ctx,"Half-Sky Radius "+round(degrees(aberrationHalfSky(currentBetaVal)),2) + "\u00B0",HEADS_UP_X,HEADS_UP_Y+HEADS_UP_SPACING*2);
  text(ctx,"Neutral Radius " + round(degrees(dopplerNeutralAngle(Math.abs(currentBetaVal))),2) + "\u00B0",HEADS_UP_X,HEADS_UP_Y+HEADS_UP_SPACING*3);
  text(ctx,"D max "+round(dopplerMax(currentBetaVal),2),HEADS_UP_X,HEADS_UP_Y+HEADS_UP_SPACING*4);
  text(ctx,"D min "+round(dopplerMin(currentBetaVal),2),HEADS_UP_X,HEADS_UP_Y+HEADS_UP_SPACING*5);
  
  var projdescr = (projectionName=="stereographic" || projectionName=="mckinley") ? "Half Sky" : "Full Sky" ;
  text(ctx,"Projection "+projdescr,HEADS_UP_X,HEADS_UP_Y_STARS+HEADS_UP_SPACING*0);
  text(ctx,"Brightness index "+round(starSummary.totalBrightnessIdx,2),HEADS_UP_X,HEADS_UP_Y_STARS+HEADS_UP_SPACING*1);
  text(ctx,"Brightest star mag "+round(starSummary.brightest,2),HEADS_UP_X,HEADS_UP_Y_STARS+HEADS_UP_SPACING*2);
  text(ctx,"Num stars in simulation "+stars.length,HEADS_UP_X,HEADS_UP_Y_STARS+HEADS_UP_SPACING*3);
  var percentStarsVisible=100*starSummary.visible/stars.length;
  text(ctx,"Stars under mag " +limitingMag+": "+starSummary.visible+" ("+round(percentStarsVisible,1)+"%)",HEADS_UP_X,HEADS_UP_Y_STARS+HEADS_UP_SPACING*4);
}

/** Draw example stars for each magnitude, showing the size of each. */
function magnitudeChart(ctx){
  for(var idx=-6; idx<=5; ++idx){
    exampleStarSize(ctx,idx);
  }
}

function exampleStarSize(ctx,mag){
  var star = new Star(mag,5000,5,0,0);
  //set the final values directly here:
  star.boostedMagnitude=mag;
  star.boostedColor=BASE_COLOR;
  star.x=HEADS_UP_X+25;
  var basey=330+1.3*HEADS_UP_SPACING*mag;
  star.y=basey;
  renderSingleStar(ctx,star);
  var textmag=mag;
  var textx=mag>= 0 ? HEADS_UP_X+5 : HEADS_UP_X;
  text(ctx,textmag,textx,basey+5);
}

function colorChart(ctx){
  //sort by the temperature, decreasing from spectral type O to M
  var allTypesByTemp=allSpectralTypes().sort(function(a,b){return b.temperature-a.temperature});
  for(var idx=0; idx<allTypesByTemp.length; ++idx){
    if ("WD"==allTypesByTemp[idx].letter){
      continue; //skip the white dwarfs
    }
    var basey=200+1.3*HEADS_UP_SPACING*idx;
    var basex=760;
    text(ctx,allTypesByTemp[idx].letter,basex,basey);
    ctx.save();
    var starColor=colorFrom(allTypesByTemp[idx].temperature);
    ctx.fillStyle=starColor;
    ctx.strokeStyle=starColor;
    spot(ctx,basex+20,basey-6,2);
    ctx.restore();
  }
}

/** 
  Returns these items, after iterating over all stars:
    the number of stars in the whole sky that are under the limiting magnitude
    the apparent magnitude of the brightest star
    the total luminosity of all the visible stars
      as an equivalent number of mag-0 stars (Vega is of mag 0.03, so it's an equivalent number of Vega's)
*/
function updatePropertiesAllStars(){
  var numStarsVisible=0;
  var brightestMag=20;
  var brightnessIdx=0; //a simple index of the sky's brightness
  var numStars=stars.length; //perf: avoid repeated lookup
  for (var idx=numStars; idx--;){ //perf: count down, compare to zero
    var star=stars[idx];
    if (updateStar(star)){
      ++numStarsVisible;
      brightnessIdx=brightnessIdx+Math.pow(2.512,0-star.boostedMagnitude); //luminosity relative to a mag-0 star (Vega)
      //brightnessIdx=brightnessIdx+(limitingMag-star.boostedMagnitude+1); //an index that's fast to compute, but much less informative
    }
    if(star.boostedMagnitude < brightestMag){
      brightestMag = star.boostedMagnitude;
    }
  }
  return {visible:numStarsVisible, brightest:brightestMag, totalBrightnessIdx:brightnessIdx};
}

/** 
 Stars are modelled here as having these properties, all with respect to the beta=0 grid:
   position as (r,theta,phi) (xyz) - parsecs as the unit of distance
   stellar type
     blackbody temperature - kelvin
     absolute magnitude
*/
function generateStarsFromSelectedPopulation(){
  var result;
  if ("nearbyAndRandom"==starPopulationName) {
    result=starsLikeSolarNeighbourhood();
  }
  else if ("nearbyAndRed"==starPopulationName){
    result=uniformRedStarField();
  }
  else if ("nearbyAndBlue"==starPopulationName){
    result=uniformBlueStarField();
  }
  else if ("yalebsc"==starPopulationName){
    result=yaleBrightStars();
  }
  return result;
  //return testStarsCross();
}

/** Cross of stars for r-theta-phi, spaced every 10 deg. */
function testStarsCross(){
  var horizontal = new Array(36);
  var STEP=radians(10);
  for (var idx=0; idx<horizontal.length; ++idx){
    var star=new Star(3,6000,5,0,0);
    if (idx<18){
      star.theta=idx*STEP; 
      star.phi=Math.PI; //left side first, start from ctr
    } 
    else {
      star.theta=(idx-18)*STEP; 
      star.phi=0; //right side second, start from ctr
    }
    horizontal[idx]=star;
  }
  var vertical = new Array(18);
  for (var idx=0; idx<vertical.length; ++idx){
    var star=new Star(3,6000,5,0,0);
    if (idx<9){
      star.theta=idx*STEP; 
      star.phi=1.5*Math.PI; //up first, start from ctr
    } 
    else {
      star.theta=(idx-18)*STEP; 
      star.phi=0.5*Math.PI; //down second, start from ctr
    }
    vertical[idx]=star;
  }
  
  return horizontal.concat(vertical);
}

function assignPositionToTesting(star){
  star.r=1;
  star.theta=0.1;
  star.phi=0.1;
}

/** 
 Quasi-random distribution, similar to that found in solar neighbourhood. 
 Outline:
  Average stellar density * volume of space => number N of stars in the volume
  Assign random positions in the volume to the N stars 
  Assign temperature T and absolute magnitude to each star, using relative frequencies of the various stellar types
*/
function starsLikeSolarNeighbourhood(){
  var result = new Array(numberOfStars());
  var starTypes = starTypesInSolarNeighbourhood();
  //var starTypes = starTypesForTesting();
  for (var idx=0; idx<result.length; ++idx){
    var star = new Star(10,10000,2,0,0);//toy starter values
    assignStellarTypeTo(star,starTypes);
    //assignPositionToTesting(star);
    assignPositionTo(star);
    result[idx]=star;
  }
  return result;
}

/** Bright red dwarfs, nearby, with the same brightness and temperature. */
function uniformRedStarField(){
  var result = new Array(numberOfStars());
  var length=result.length;
  for (var idx=0; idx<length; ++idx){
    var star = new Star(10,10000,2,0,0);//toy starter values
    star.temperature=3050;
    star.absoluteMagnitude=10;
    assignPositionTo(star);
    star.r=0.5; //override the random distance
    result[idx]=star;
  }
  return result;
}

/** Class A stars, nearby, with the same brightness and temperature. */
function uniformBlueStarField(){
  var result = new Array(numberOfStars());
  var length=result.length;
  for (var idx=0; idx<length; ++idx){
    var star = new Star(2,8750,5,0,0);//toy starter values
    star.temperature=8750;
    star.absoluteMagnitude=2;
    assignPositionTo(star);
    star.r=10; //override the random distance
    result[idx]=star;
  }
  return result;
}

function numberOfStars(){
  var result=Math.round(VOLUME_OF_SPACE * averageStellarDensity);
  return result;
}

/** 
 Source: 
   http://en.wikipedia.org/wiki/Stellar_classification (temperature; not trustworthy for rel. freq.)
   http://astro.pas.rochester.edu/~aquillen/ast142/costanti.html  (absolute visual magnitude)

  Landolt-Bornstein tabulations by w. Gliese. (relative frequency)
  http://link.springer.com/chapter/10.1007/10201983_34
   
 Main sequence and white dwarf stars.   
 White dwarfs are included, since they aren't rare (~5%). 
 Excluded because of their rarity (<1%):
  Subdwarfs, giants, supergiants
  
 M stars are a problem: they are the most frequent, and there brightness varies widely.
 It's best to break them down into finer divisions.
*/
function starTypesInSolarNeighbourhood(){
  var result=allSpectralTypes(); //ordered by rel freq by default
  setFrequencyFencepostsFor(result); //must be done at end, when all freq's are known
  return result;
}

/** 
 The frequency fencepost implements a simple binning mechanism for star types. 
 It's used with a random number in the range 0..1.
 The random number will pick the given star type with the appropriate frequency.
*/
function setFrequencyFencepostsFor(starTypes/*MUST BE ORDERED, most frequent first*/){
  var fencepost=0;
  for(var idx=0; idx<starTypes.length; ++idx){
    fencepost=fencepost+starTypes[idx].frequency;
    starTypes[idx].fencePost=fencepost;
  }
}

/** Star type is assigned according to the relative frequency of that spectral class. */
function assignStellarTypeTo(star,starTypes){
  var randomNum = Math.random();
  var length=starTypes.length;
  for(var idx=0; idx<length; ++idx){
    if (randomNum<=starTypes[idx].fencePost){
      star.temperature=starTypes[idx].temperature;
      star.absoluteMagnitude=starTypes[idx].absoluteMagnitude;
      hackyTweaksForWhiteDwarfsAndMStars(star,starTypes[idx]);
      break;
    }
  }
}

function hackyTweaksForWhiteDwarfsAndMStars(star,starType){
  if(starType.letter=="WD"){
    var whiteDwarfProps=randomWhiteDwarf();
    star.temperature=whiteDwarfProps.temperature;
    star.absoluteMagnitude=whiteDwarfProps.absoluteMagnitude;
  }
  else if(starType.letter=="M"){
    star.absoluteMagnitude=randomMagnitudeForSpectralClassM();
  }
}

/**
  Simplistic model of white dwarf temperature and absolute magnitude.
  A random place on a line on the H-R diagram, from B0(30,000K)/mag 11 to G9(5200K)/mag 15.
*/
function randomWhiteDwarf(){
  var result={};
  var randomIdx=Math.random();
  result.temperature=30000-randomIdx*(30000-5200);
  result.absoluteMagnitude=11+randomIdx*(15-11);
  return result;
}

/**
 Spectral class M stars are very common, so it helps to characterize them a bit
 more precisely. The problem addressed here is that their absolute magnitude 
 varies widely. This function simply returns a random temp in the range 10.3-16.0.
 In actuality, the temp's seem to peak in the middle, but this may be a selection effect, 
 which neglects the dimmer stars; it may be the case that the dimmer stars are 
 under-represented in the data.
 This is simplistic, but suffices for the present.
*/
function randomMagnitudeForSpectralClassM(){
  var randomIdx=Math.random();
  return 10.3 + randomIdx*(16.0-10.3);
}

/**
 Random position in the unboosted sky.
 Just choosing random theta and phi is incorrect, and will not give random directions 
 across the sphere.
 Reference: http://mathworld.wolfram.com/SpherePointPicking.html
*/
function assignPositionTo(star){
  //random position in spherical volume, radius in parsecs
  star.r=random(RADIUS_IN_SPACE);
  var u=Math.random();
  var v=Math.random();
  star.theta=Math.acos(2*v-1);
  star.phi=2*Math.PI*u;
}

/** An extract of stars from the Yale Bright Star Catalog. */
function yaleBrightStars(){
  //this is declared as a global var in a neighbouring javascript file.
  return STARS_YALE_BSC;
}




// ***************************************** 
// UPDATE STATE, THEN RENDER THE SKY
// *****************************************

/** 
 Update all of the star's properties, per the current boost and doppler factor. 
 Return value indicates if the updated star has a mag under the limiting mag.
*/
function updateStar(star){
  var isYaleCatalog=Boolean(starPopulationName == "yalebsc");
  var starTheta = isYaleCatalog ? (Math.PI/2 - star.theta) : star.theta; // 0..pi
  //aberration always comes first, then doppler uses the new angle!
  var thetaprime=aberrationDecr(starTheta,currentBetaVal);
  var dopp=doppler(currentBetaVal,thetaprime);
  star.populateBoostedItems(dopp,isYaleCatalog);
  var coords=projection(thetaprime,star.phi);
  star.x=coords.x;
  star.y=coords.y;
  return star.boostedMagnitude<=limitingMag;
}

/** Draw all the stars, using their new state, which has already been found. */
function renderStars(ctx){
  var numStars=stars.length; //perf: avoid repeated lookup
  for (var idx=numStars; idx--;){ //perf: compare to 0
    var star=stars[idx];
    if (star.boostedMagnitude<=limitingMag){
      if ("mckinley"==projectionName || "stereographic"==projectionName){
        //these aren't whole-sky projections
        if (distance(CTRX,CTRY,star.x,star.y)<RADIUS){
          renderSingleStar(ctx,star);
        }
      }
      else {
        renderSingleStar(ctx,star);
      }
    }
  }
}

/** 
 Uses the stars x,y, boosted mag, and boosted color. 
 Rendering circles on the canvas is slow, and can degrade performance.
 The user is allowed to turn off circles altogether.
*/
function renderSingleStar(ctx,star){
  ctx.save();
  //console.log(star.temperature);
  var color = showColor ? star.boostedColor : "rgb(255,255,255)";
  ctx.fillStyle=color;
  ctx.strokeStyle=color;
  if (star.boostedMagnitude>4.5){
    point(ctx,star.x,star.y); //dimmest, most common
  }
  else if (star.boostedMagnitude>0.5 || !circles){
    square(ctx,star.x,star.y,magToSquareSize(star.boostedMagnitude));
  }
  else {
    //brightest, least common; circles are apparently performance hogs
    //spots are really slow!!! you can this especially when the number of stars is high
    spot(ctx,star.x,star.y,magToSpotSize(star.boostedMagnitude));
  }
  ctx.restore();
}

/** 
 Translate a magnitude to a spot size.
 The caller will need to decide if a spot is too small to plot.
*/
function magToSpotSize(mag){
  var result=0;
  var MAG_0_SIZE=0.75;
  var MAG_5_SIZE=0.1;
  var BASE_RANGE=MAG_0_SIZE-MAG_5_SIZE;
  result=MAG_0_SIZE - mag * (BASE_RANGE/5);
  return result;
}

function magToSquareSize(mag){
  var result=0;
  var MAG_0_SIZE=3;
  var MAG_5_SIZE=1;
  var BASE_RANGE=MAG_0_SIZE-MAG_5_SIZE;
  result=MAG_0_SIZE - mag * (BASE_RANGE/5);
  return result;
}

/** Returns absolute (x,y) ready for drawing.*/
function projection(thetaprime/*aberrated zenith angle, 0..pi*/,phi/*0..2pi*/){
  var result;
  if ("stereographic"==projectionName){
    result=stereographicProjection(thetaprime,phi);
  }
  else if ("mckinley"==projectionName){
    result=mckinleyProjection(thetaprime,phi);
  }
  else {
    var coords=coordsLikeMap(thetaprime,phi);
    if ("equirectangular"==projectionName){
      result=equiRectangularProjection(coords.latitude,coords.longitude);
    }
    else if ("hammer"==projectionName){
      result=hammerProjection(coords.latitude,coords.longitude);
    }
    else if ("behrmann"==projectionName){
      result=behrmannProjection(coords.latitude,coords.longitude);
    }
  }
  return result;
}

/** 
 Equatorial stereographic projection. 
 Returns absolute (x,y) ready for drawing.
*/
function stereographicProjection(thetaprime/*aberrated zenith angle*/,phi){
  //unit sphere
  //var r=Math.sin(thetaprime)/(1-Math.cos(thetaprime)); //wikipedia appears to be stupid on this point
  var r=(1-Math.cos(thetaprime))/Math.sin(thetaprime); //me
  var deltax=RADIUS * r * Math.cos(phi);
  var deltay=RADIUS * r * Math.sin(phi);
  return {x:CTRX+deltax,y:CTRY+deltay};
}

/** Not 100% sure about this, but it's likely correct; they don't name the projection, or describe it in detail. */
function mckinleyProjection(thetaprime,phi){
  var r=Math.sqrt(1-Math.cos(thetaprime));
  var deltax=RADIUS * r * Math.cos(phi);
  var deltay=RADIUS * r * Math.sin(phi);
  return {x:CTRX+deltax,y:CTRY+deltay};
}

/** 
  Transform to numbers that can be plugged directly into typical formulas for map projections,
  mimicking latitude and longitude (positive east of the prime meridian).
  
  In essence, this changes from a pole-on view using (r,theta,phi) 
  and having the z-axis into the screen, to a pole-up view, 
  with latitude up-down, and longitude left-right. 
  
  I derived this directly using spherical trig formulas (cosine and sine law) on a single triangle.
  Note the use of atan2 to get the correct quadrant.
*/
function coordsLikeMap(thetaprime/*aberrated angle*/,phi){
  var x=phi-1.5*Math.PI;
  var latitudeVal=Math.asin(Math.sin(thetaprime)*Math.cos(x)); //-pi/2..+pi/2
  var longitudeVal=Math.atan2(Math.sin(thetaprime)*Math.sin(x),Math.cos(thetaprime)); //-pi..+pi  
  return {latitude: -latitudeVal, longitude:longitudeVal}; //lat -90..+90, long -180..+180
}

/** Whole-sky projection. The simplest formula. */
function equiRectangularProjection(lat,longit){
  var deltax=MAP_SCALE * longit;
  var deltay=MAP_SCALE * lat;
  return {x:CTRX+deltax,y:CTRY+deltay};
}

/** Whole-sky projection, equal-area. */
function behrmannProjection(latitude,longitude){
  return equalAreaCylindrical(latitude,longitude,radians(30),MAP_SCALE*1.3);
}

/** There are many variations on this projection. */
function equalAreaCylindrical(latitude,longitude,standardLat,scale){
  var deltax=scale*longitude*Math.cos(standardLat);
  var deltay=scale*Math.sin(latitude)/Math.cos(standardLat);
  return {x:CTRX+deltax,y:CTRY+deltay};
}

/** Whole-sky projection. Boundary is a 2:1 ellipse.*/
function hammerProjection(latitude,longitude){
  var deltax=1.2*MAP_SCALE*2*Math.sqrt(2)*Math.cos(latitude)*Math.sin(longitude/2);
  var deltay=1.2*MAP_SCALE*Math.sqrt(2)*Math.sin(latitude);
  return {x:CTRX+deltax,y:CTRY+deltay};
}

/** 
 A visual indication of the half-sky radius and the neutral radius. 
 Show the half-sky radius and the neutral radius. 
 Show the unaberrated half-sky as well.
*/
function showHalfSkyAndNeutral(ctx){
  var halfSkyRadius=aberrationHalfSky(currentBetaVal);
  var neutralRadius=dopplerNeutralAngle(Math.abs(currentBetaVal));
  var halfSkyCoords=projection(halfSkyRadius,0);
  var neutralCoords=projection(neutralRadius,0);
  if ("mckinley"==projectionName || "stereographic"==projectionName){
    //the returned angles are already aberrated
    ctx.save();
    ctx.lineWidth=1;
    circle(ctx,CTRX,CTRY,halfSkyCoords.x-CTRX);
    ctx.save();
    ctx.strokeStyle="rgb(202,215,255)";
    circle(ctx,CTRX,CTRY,neutralCoords.x-CTRX);
    ctx.restore();
    ctx.restore();
  }
}

/** 
 This doesn't seem very useful to most users. But it serves to eyeball the character 
 of the projection. (DEV ONLY. NOT CALLED.)
*/
function showCoordRadii(ctx){
  ctx.save();
  ctx.font = '8px sans-serif';
  ctx.lineWidth=1;
  for (var idx=0; idx<121; idx=idx+10){
    var thetaprime=aberrationDecr(radians(idx),currentBetaVal);
    var coords=stereographicProjection(thetaprime,0);
    circle(ctx,CTRX,CTRY,coords.x-CTRX);
    text(ctx,idx,CTRX+coords.x-CTRX,CTRY);
  }
  ctx.restore();
}
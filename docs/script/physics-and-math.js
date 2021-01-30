/** 
 Various formulas that implement pure physics, math, or geometric operations.
 No graphics involved.
*/

/** Lorentz (warp) factor. */
function gamma(beta){
  var radical = 1 - beta*beta;
  return 1/Math.sqrt(radical);
}

/** Angle in radians, versus the ct axis, made by the history of an object moving at the given speed. */
function betaAngleWithCtAxis(beta){
  return Math.arctan(beta);
}

/** Return the Lorentz transformation of the given event. */
function lorentz(x,ct,beta){
  var result = {};
  var gamma = 1/(Math.sqrt(1-beta*beta));
  result.x = parseFloat(gamma*x-beta*gamma*ct);
  result.ct = -beta*gamma*x+gamma*ct;
  return result;
}

/**
 Rotate an xyz position about the origin.
 Follows the same 'zxz' convention as in Landau and Lifshitz.
 There are 3 rotation angles (in radians) to go from the old to the new coord system.
 In order, they are:
  an angle phi about the z-axis  (rotation1)
  an angle theta around the new x-axis (rotation2)
  an angle psi about the new z-axis (rotation3)
 All of the above rotations are anti-clockwise, as viewed from the positive end of the 'about' axis.
 Reference: http://mathworld.wolfram.com/EulerAngles.html
 When the angles are all zero, then the rotation matrix is the identity matrix.
*/
function rotate(point/*xyz*/,phi,theta,psi){
  var result = {}; //default
  if ((phi==0) && (theta==0) && (psi==0)){
    result.x = point.x;
    result.y = point.y;
    result.z = point.z;
    return result; //early return
  }
  var a11 = Math.cos(psi)*Math.cos(phi) - Math.cos(theta)*Math.sin(phi)*Math.sin(psi);
  var a12 = Math.cos(psi)*Math.sin(phi) + Math.cos(theta)*Math.cos(phi)*Math.sin(psi);
  var a13 = Math.sin(psi)*Math.sin(theta);
  var a21 = -Math.sin(psi)*Math.cos(phi) - Math.cos(theta)*Math.sin(phi)*Math.cos(psi);
  var a22 = -Math.sin(psi)*Math.sin(phi) + Math.cos(theta)*Math.cos(phi)*Math.cos(psi);
  var a23 = Math.cos(psi)*Math.sin(theta);
  var a31 = Math.sin(theta)*Math.sin(phi);
  var a32 = -Math.sin(theta)*Math.cos(phi);
  var a33 = Math.cos(theta);
  result.x = a11*point.x + a12*point.y + a13*point.z;
  result.y = a21*point.x + a22*point.y + a23*point.z;
  result.z = a31*point.x + a32*point.y + a33*point.z;
  return result;
}

/** Aberration formula that decreases theta. Radians. The pi-complement of the incr version of this function. */
function aberrationDecr(theta,beta){
  var costhetaprime = (Math.cos(theta) + beta)/(1+beta*Math.cos(theta));
  return Math.acos(costhetaprime);
}

/** Aberration formula that increases theta. Radians. The pi-complement of the decr version of this function. */
function aberrationIncr(theta,beta){
  var costhetaprime = (Math.cos(theta) - beta)/(1-beta*Math.cos(theta));
  return Math.acos(costhetaprime);
}

/** 
 In the moving frame, a small circle of this radius (in rads, 0..pi/2) from the direction of motion 
 will contain half of the objects in the sky. This is a simple measure of how concentrated things are 
 in the forward direction of motion.
 WARNING: with a screen of non-default resolution, the angles measured on screen may be distorted!!
*/
function aberrationHalfSky(beta){ 
  return aberrationDecr(Math.PI/2,Math.abs(beta)); 
}

/** 
 Doppler factor. Use convention that D increases with increasing energy (not increasing wavelength). 
*/
function doppler(beta,theta/*optional*/){
 var gammaVal=gamma(beta);
 var denom;
 if (theta){
   denom=gammaVal*(1-beta*Math.cos(theta));
 }
 else {
   denom=gammaVal*(1-beta);
 }
 return 1/denom;
}

function dopplerMax(beta){
  return doppler(beta,0);
}

function dopplerMin(beta){
  return doppler(beta,Math.PI);
}

/** 
 Angle for which D is 1. The angle is measured in the same way as theta, and 
 is in the range 0..pi. 
 If you want the value in 0..pi/2 (which is more natural, for most people), 
 then just pass the absolute value of beta.
*/
function dopplerNeutralAngle(beta){ 
  if (beta==0){
    return Math.PI/2;
  }
  else {
    return Math.PI/2 - (gamma(beta)-1)/(gamma(beta)*beta);
  }
}

/**
  Boost transformation of velocities expressed as betas.
  This impl uses beta's - speeds expressed as a fraction of the speed limit.
  The primed grid moves in the +x direction at speed beta.
  Given the unprimed betas, returns the primed betas in the primed grid.
*/
function boostVelocity(beta/*boost between grids, along x axis*/,betax,betay,betaz){
  var result = {};
  var gammaVal=gamma(beta);
  var denom=1-beta*betax;
  result.betaxp=(betax-beta)/denom;
  result.betayp=betay/(gammaVal*denom);
  result.betazp=betaz/(gammaVal*denom);
  return result;
}

/** Apparent v seen from a detector. Returns the transverse and radial parts, bt and br. */
function apparentVelocity(beta/*0..1*/,theta/*0..pi, angle between line-of-sight and line-of-motion*/){
  var numer1 = beta * Math.sin(theta); 
  var numer2 = beta * Math.cos(theta); 
  var denom = 1 - beta * Math.cos(theta);
  return {t:numer1/denom, r:numer2/denom};
}

/** Return the peak of the transverse velocity, both theta (0..pi) and b. */
function apparentVelocityTransverseMax(beta){
  return {theta:Math.acos(beta), b:beta*gamma(beta)};
}

/** Spectral classes and their (mean) properties. */
function SpectralType(name,temp,absMag,relFreq){
  this.letter=name;
  this.temperature=temp;
  this.absoluteMagnitude=absMag;
  this.frequency=relFreq;
  this.fencePost=0; //to be overwritten later; calc'd from relative freq, and depends on all values as a whole
}

/** Default sort is by relative frequency. Includes WD for white dwarf, which is treated as an oddball. */
function allSpectralTypes(){
  var result=new Array(8);
  result[0]=new SpectralType("M",3050,13.9,0.7937497); //the freq has spurious precision, to make sure all add up to 1.0
  result[1]=new SpectralType("K",4450,7.5,9,0.10);
  result[2]=new SpectralType("WD",30000,11,0.05);
  result[3]=new SpectralType("G",5600,5.2,0.03);
  result[4]=new SpectralType("F",6750,3.4,0.02);
  result[5]=new SpectralType("A",8750,1.9,0.005);
  result[6]=new SpectralType("B",20000,-1.1,0.00125);
  result[7]=new SpectralType("O",30000,-5.6,0.0000003); //the temp is the lower limit, in this rare case
  return result;
}

/** Translate a spectral type into a corresponding representative temperature. */
function spectralTypeToTemperature(spectralType){
  var allSpTypes=allSpectralTypes();
  var result=0;
  for(var idx=0; idx<allSpTypes.length; ++idx){
    if(allSpTypes[idx].letter==spectralType){
      result=allSpTypes[idx].temperature;
      break;
    }
  }
  return result;
}

/** 
 Translate a star's black-body surface temperature in Kelvin to a corresponding approximate color. 
 The perception of color in starlight by the human eye is poor.
 There's no attempt to distinguish the colors of main sequence and 
 non-main sequence stars; those differences appear to be small.
 Taken from:
   http://www.vendian.org/mncharity/dir3/starcolor/details.html
   http://en.wikipedia.org/wiki/Stellar_classification
*/
function colorFrom(temperature){
  var result="rgb(255,255,255)"; //default
  //note that these temperatures denote the LOWER ENDPOINT endpoint of the corresponding spectral class, 
  //not the mean 
  if (temperature>=30000){ //O
    result="rgb(155,176,255)";
  }
  else if (temperature>=10000){ //B
    result="rgb(170,191,255)";
  }
  else if (temperature>=7500){ //A
    result="rgb(202,215,255)";
  }
  else if (temperature>=6000){ //F
    result="rgb(248,247,255)";
  }
  else if (temperature>=5200){ //G
    result="rgb(255,244,234)";
  }
  else if (temperature>=3700){ //K
    result="rgb(255,210,161)";
  }
  else if (temperature>=2400){ //M
    result="rgb(255,204,111)";
  }
  return result;
}

/** 
 Stars and their properties.
 Creating all these properties at once, when the Object is created, will often help performance.
 
 The data is treated differently in different cases.
 The Yale Bright Star Catalog:
    has apparent mag, which is passed here instead of absolute mag
    has patchy distance data, which is passed here as the toy value of 1, and is not used anywhere
    has right ascension and declination, which are used instead of phi and theta, respectively
*/
function Star(mag/*absolute*/,temp,rVal,thetaVal,phiVal){
  //these initial items don't change once set
  this.absoluteMagnitude=mag;
  this.temperature=temp; //kelvins, blackbody temperature
  //position in the sky, unboosted grid, spherical coords:
  this.r=rVal; //distance in parsecs
  this.theta=thetaVal; //zenith angle, from z-axis (directly in to the screen)
  this.phi=phiVal; //azimuth angle, around z-axis
  
  //the remaining items are the results of calculations, and are used for 
  //rendering the star each time the canvas is drawn
  this.boostedMagnitude=3;
  this.boostedColor="rgb(255,255,255)"; //white
  this.x=0; //position on the canvas, ready for rendering
  this.y=0;
}
/** Calc items that are used for final rendering (except for x,y). */
Star.prototype.populateBoostedItems = function(doppler,isYaleBrightStar){
 var apparentMagnitude=0;
  if(isYaleBrightStar){
    apparentMagnitude = this.absoluteMagnitude; //see comment above
  }
  else {
    apparentMagnitude = this.absoluteMagnitude - 5 + 5*log10(this.r); 
  }
  //this.boostedMagnitude = apparentMagnitude + 2.5*log10(doppler) - 26000*(1/this.temperature - 1/(doppler*this.temperature));
  this.boostedMagnitude = apparentMagnitude + deltaMagnitude(doppler,this.temperature);
  var boostedTemperature = this.temperature * doppler; //an intermediate value
  this.boostedColor = colorFrom(boostedTemperature);
}

/** 
 The change in apparent magnitude of a star, according to the formula of McKinley and Doherty (1979). 
 Uses the blackbody approximation.
*/
function deltaMagnitude(doppler,temperature){
  return 2.5*log10(doppler) - 26000*(1/temperature - 1/(doppler*temperature));
}


/** Log base 10 of x.*/
function log10(x){
  return Math.LOG10E * Math.log(x);
}

function radians(degrees){
  return degrees * Math.PI/180;
}

function degrees(radians){
  return radians * 180/Math.PI;
}

/** Return the distance between the given points. */
function distance(x1,y1,x2,y2){
  var dx=x2-x1;
  var dy=y2-y1;
  return Math.sqrt(dx*dx+dy*dy);
}

/** Random number from 0..max. */
function random(max){
  return Math.random()*max;
}

/** Round a given number to the given number of decimals. */
function round(number,decimals){
  var result=0;
  if (decimals>0){
    var multiplier = Math.pow(10,decimals);
    var temp = number*multiplier; //move the decimal point
    temp = Math.round(temp);
    result=padRight(temp/multiplier, decimals+1); //move the decimal point back
  }
  else {
    result=Math.round(number);
  }
  return result;
}

/** Pad a DECIMAL number with 0's on the right, to ensure it has the given number of decimals. */
function padRight(number,decimals){
  var result = String(number);
  var DECIMAL_POINT = '.';
  if (result.indexOf(DECIMAL_POINT) == -1){
    //add a decimal point if there isn't any
    result = result + DECIMAL_POINT;
  }
  while (numDecimals(result) < decimals){
    result = result + '0';
  }
  return result;
}

/** Return the number of decimals present in the given number. */
function numDecimals(number){
  var result = 0; //default if no decimal point present, or it appears at the end
  var num = String(number);
  var DECIMAL_POINT = '.';
  var dpIdx = num.indexOf(DECIMAL_POINT);
  if (dpIdx != -1 && dpIdx != (num.length-1)){
    //has a decimal point, and it's not at the end
    result = num.length - dpIdx;
  }
  return result;
} 



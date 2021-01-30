/*
 The allowable transformations for an inertial grid.
   * displace, parity, rotate, boost
  Show grid against a background of stars.
  The grids are displaced, rotated, and moved, according to user operations.
  The user controls what to change, and how many steps to use, but not the exact step size.
  Each time Transform or Reset is clicked, the animation is restarted.

  Implemented mostly using transforms. The order of operations is important.
    translate to P, rotate around P, then draw.  
    
  The animation isn't as smooth as I would like it to be.
*/

int WIDTH = 800;
int HEIGHT = 600;

int NUM_STARS = 100;
var stars = new Array(NUM_STARS);

color X_COLOR = color(255,255,255);
color Y_COLOR = color(0,0,0);

//drawing of the grid takes place symmetrically about the origin, 
//then gets translated elsewhere, then rotated last
float HOME_X = 0.0;
float HOME_Y = 0.0;

float TRANSLATE_STEP_SIZE = WIDTH/20;
float translatex = WIDTH/2;
float translatey = HEIGHT/2;
float translatet = 0.0;

float BOOST_STEP_SIZE = 3.0;
float boostx = 0;
float boosty = 0;

float ROTATION_STEP_SIZE = 0.10;
float rotation1 = 0;

int numSecondsOnSensorClock = 0;
color SENSOR_COLOR_1 = color(255,255,255);
color SENSOR_COLOR_2 = color(255,0,0);
int SENSOR_SIZE=12;
float CLOCK_STEP = TWO_PI/12;

boolean reverset = false;
boolean reversex = false;
boolean reversey = false;

/** Reset to the current time when the animation is restarted. */
float startTime = millis();

void setup(){
  // why is this not square-ish????
  size(WIDTH, HEIGHT);  //must be the first line!
  stroke(0); //color of things drawn
  fill(0);
  randomStars(NUM_STARS); 
  frameRate(10);
}

/** 
 Random, fixed 'stars' of various random sizes. 
 Since the frame is redrawn from scratch, these stars 
 must be generated once, and then remembered for later rendering.
*/
void randomStars(num){
  for (int i=0; i<NUM_STARS; i=i+1){
    float randomx = random(0,WIDTH);
    float randomy = random(0,HEIGHT);
    float size = random(0,2);
    var star = new Object();
    star.x = randomx;
    star.y = randomy;
    star.size = size;
    stars[i] = star;
  }  
}

/** Change the values of global variables used to draw the screen. */
void applyUserInput(translatexSteps, translateySteps, translatetSteps, reverseTime, boostxSteps, boostySteps, rotationDegrees, reversexToggle, reverseyToggle){
  startTime = millis(); //start over
  translatex = WIDTH/2 + TRANSLATE_STEP_SIZE * translatexSteps;
  translatey = HEIGHT/2 + TRANSLATE_STEP_SIZE * translateySteps;
  translatet = float(translatetSteps); //otherwise treats as text??
  boostx = BOOST_STEP_SIZE * boostxSteps;
  boosty = BOOST_STEP_SIZE * boostySteps;
  rotation1 = radians(rotationDegrees);
  reversex = reversexToggle;
  reversey = reverseyToggle;
  reverset = reverseTime;
}

/** Return to the state seen when the page was first loaded. */
void resetAll(){
  applyUserInput(0,0,0,false,0,0,0,false,false);
}

/*
 Can use the built-in width and height identifiers.
 Draw the grid according to the user's input, N times per second.
*/
void draw(){
  background(200); //also clears the display at the start of each frame
  //draw reverts transforms automatically at the start of each call
  stroke(0);
  drawStars(); 
  
  //apply transforms  
  translate(translatex + getSecondsElapsed() * boostx, translatey + getSecondsElapsed() * boosty);
  rotate(rotation1);
  //now draw the lattice around the origin
  lattice2d(2,30,HOME_X,HOME_Y); 
}

void drawStars(){
  for (int i=0; i<NUM_STARS; i=i+1){
    star = stars[i];
    ellipse(star.x, star.y, star.size, star.size); 
  }
}

/** 
 Square 2D lattice with n items on a side, 
 with its origin at the given location.
*/
void lattice2d(n,step,x,y){
  linesJoiningSensors(n,step,x,y);
  indicatePositiveDirectionsOnAxes(n,step,x,y);  
  sensors(n,step,x,y);
}

void linesJoiningSensors(n,step,x,y){
  for (int lineIdx=-n;lineIdx<=n;++lineIdx){
    stroke(Y_COLOR);
    line(x+lineIdx*step,y+n*step, x+lineIdx*step,y-n*step);
    stroke(X_COLOR);
    line(x+n*step,y+lineIdx*step, x-n*step,y+lineIdx*step);
    //back to defaults
    stroke(0);
  }
}

void indicatePositiveDirectionsOnAxes(n,step,x,y){
  strokeWeight(3);
  stroke(X_COLOR);
  float endX = reversex ? x-n*step : x+n*step;
  line(x,y,x+endX,y);
  stroke(Y_COLOR);
  float endY = reversey ? y-n*step : y+n*step;
  line(x,y,x,endY);
  //back to defaults
  strokeWeight(1);
  stroke(0);
}

void sensors(n,step,x,y){
  float currentTime = getSensorTime();
  for(int i=-n;i<=n;++i){
    for(int j=-n;j<=n;++j) {
      sensor(x+i*step,y+j*step,currentTime); 
    }
  }  
}

/** 
 Seconds since this animation started, or was restarted. 
 The animation is restarted every time Transform or Reset is clicked.
 This has nothing to do with the draw loop, which works continuously.
 It's just related to the system time.
*/
float getSecondsElapsed(){
  return (millis() - startTime)/1000;
}

/** The current reading on the sensor clocks, incorporating displacements and reversals. */
int getSensorTime(){
  float secs = getSecondsElapsed();
  if (reverset){
    secs = -1 * secs;
  }
  secs = secs + translatet;
  return secs;
}

/**
 A sensor has a clock.
 All the sensor clocks are synchronized.
 The clocks can be reset to 0, and they can decrease going into the future.
*/
void sensor(x,y,currentTime){
  float radians = 0.0;
  float baseAngle = ((abs(currentTime)*CLOCK_STEP) % TWO_PI);
  if (currentTime<0){
    radians = TWO_PI - baseAngle;
  }
  else {
    radians = baseAngle;
  }
  fill(255,0,0); //red pie
  arc(x,y,SENSOR_SIZE,SENSOR_SIZE,0,radians);
  fill(255); //white filler
  arc(x,y,SENSOR_SIZE,SENSOR_SIZE,radians,TWO_PI);
  fill(0);
}


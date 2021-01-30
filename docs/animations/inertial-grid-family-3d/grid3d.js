/**
 The inertial grid family.
 The transforms that an inertial grid may undergo, and still remain an inertial grid.
 
 Uses a simple wire-frame, which is the simplest and quickest way of drawing a 3D object.
 No attempt is made to detect surfaces, or to remove lines that shouldn't be visible.
 In this case, that doesn't really seem necessary.
 To avoid problems with depth, the sensors are modeled as a SINGLE color; to denote 
 the passage of time, the sensor color cycles through a range, forward or backward.
 
 The grid data is generated on-the-fly in for-loops, and transformed with the equivalent 
 of matrices. There is no global variable that holds the positions of the grid vertices.
 SHOULD I STORE THE MOST RECENT POS, THEN UPDATE FOR THE CURRENT TIME? MIGHT BE MORE PERFORMANT.
 
 Internally, this code uses a right-handed xyz coord system.
 For the core calculation, the sensors are symmetric about the origin.
 Then the following are applied, in this order (is the order really necessary?):
   - Euler rotations around the axes
   - reversal of axes (including time)
   - displacement to a new origin (including time)
   - boost (as a time-dependent part of the displacement)
   
 In fact, three displacements are added together into one canvas translate operation:
   - placing the grid's default center in the +x+y+z quadrant
   - the user's displacement entry
   - the boost is also added, as the only time-dependent part of the translation

  After the core calculation is done, a second calc is done for presenting the 
  results on screen. 
    - project the grid sensors onto the xy plane, using a camera in the +x+y-z quadrant
    - the camera can be at z = -infinity (easily changed in the code)
  This style is selected to match the axes of the HTML canvas.
   
 The camera is looking at the sensor grid 'through' the xy plane.
 The simplest kind of projection just sets z=0, but it has a poor sense of depth.
 Another projection finds the intersection point of the rays from the camera to 
 the sensor with the xy plane. (When the camera is at infinity, you get the z=0 
 kind of projection.)
*/

/** Must match the canvas. */
var WIDTH = 800;
var HEIGHT = 600;

/** The number of sensors on either side of the origin. */
var GRID_SIZE = 1;
var SENSOR_SPACING = 40;
var END_OF_AXIS = GRID_SIZE * SENSOR_SPACING;

/** Default center/origin of the sensor grid, in the +x+y+z quadrant. */
var X0 = WIDTH/2;
var Y0 = HEIGHT/2;
var Z0 = WIDTH/2; //arbitrary; the position relative to the camera position is what really matters

/** Point-of-view coords, for the camera which "views" the grid. */
var CAMERA_X0 = X0;
var CAMERA_Y0 = Y0; 
//var CAMERA_Z0 = +150; //for negative values, this gives poor results
var CAMERA_Z0 = +100; //for negative values, this gives poor results

var startTime = millis(); //reset when the user picks new settings

var TRANSLATE_STEP_SIZE = WIDTH/40;
var translatex = 0;
var translatey = 0;
var translatez = 0;
var translatet = 0.0;

var reversex = false;
var reversey = false;
var reversez = false;
var reverset = false;

var ROTATION_STEP_SIZE = 0.10;
var rotation1 = 0;
var rotation2 = 0;
var rotation3 = 0;

var BOOST_STEP_SIZE = 2.0;
var boostx = 0;
var boosty = 0;
var boostz = 0;
var Z_BOOST_STEP_SIZE = 10.0; //fudge to make z-motions faster

var NUM_STARS = 100;
var stars = randomStars(NUM_STARS);

/** Change/cycle the color of the sensor to show the ticking of its clock. */
var SENSOR_COLORS = ["green", "orange", "red"];

/** 
 Change the values of global variables used to draw the screen. 
 The changes will be seen the next time the canvas is drawn.
*/
function applyUserInput(
  translatexSteps, translateySteps, translatezSteps, translatetSteps, 
  reversexToggle, reverseyToggle, reversezToggle, reverseTime, 
  rotation1Degrees,rotation2Degrees,rotation3Degrees,
  boostxSteps, boostySteps, boostzSteps
 ){
  startTime = millis(); //start over
  translatex = TRANSLATE_STEP_SIZE * translatexSteps;
  translatey = TRANSLATE_STEP_SIZE * translateySteps;
  translatez = TRANSLATE_STEP_SIZE * translatezSteps;
  translatet = parseInt(translatetSteps); //treats as string? why?
  reversex = reversexToggle;
  reversey = reverseyToggle;
  reversez = reversezToggle;
  reverset = reverseTime;
  rotation1 = radians(rotation1Degrees);
  rotation2 = radians(rotation2Degrees);
  rotation3 = radians(rotation3Degrees);
  boostx = BOOST_STEP_SIZE * boostxSteps;
  boosty = BOOST_STEP_SIZE * boostySteps;
  boostz = BOOST_STEP_SIZE * boostzSteps;
}

/** 
 Draw the canvas, using the current settings input by the user. 
 The caller needs to clear the canvas before calling this method.
*/
function drawCanvas(ctx){
  //logSettings(ctx);
  //drawStars(ctx);
  drawGrid(ctx);
}

function logSettings(ctx){
  status(ctx,"translatex:" + translatex,1);
  status(ctx,"translatey:" + translatey,2);
  status(ctx,"translatez:" + translatez,3);
  status(ctx,"boostx:" + boostx,4);
  status(ctx,"boosty:" + boosty,5);
  status(ctx,"boostz:" + boostz,6);
  status(ctx,"sensor.x:" +  (X0 + translatex + BOOST_STEP_SIZE*boostx*secondsFromStart()), 7);
  status(ctx,"sensor.y:" +  (Y0 + translatey + BOOST_STEP_SIZE*boosty*secondsFromStart()), 8);
  status(ctx,"sensor.z:" +  (Z0 + translatez + Z_BOOST_STEP_SIZE*BOOST_STEP_SIZE*boostz*secondsFromStart()), 9);
  status(ctx,"X0:" + X0,10);
  status(ctx,"Y0:" + Y0,11);
  status(ctx,"Z0:" + Z0,12);
}

function drawStars(ctx){
  for (var i=0; i<NUM_STARS; i=i+1){
    star = stars[i];
    spot(ctx,star.x,star.y,star.size);
  }
}

function drawGrid(ctx){
  drawAxes(ctx);
  connectTheSensors(ctx);
  drawSensors(ctx);
}

/**
 Draw the main axes in bold, to indicate the direction of the +axis (for parity reversals).
*/
function drawAxes(ctx){
 var center = projection(transform({x:0, y:0, z:0}));
 drawAxis(ctx, center, {x:END_OF_AXIS, y:0, z:0},reversex);
 drawAxis(ctx, center, {x:-END_OF_AXIS, y:0, z:0},!reversex);
 
 drawAxis(ctx, center, {x:0, y:END_OF_AXIS, z:0},reversey);
 drawAxis(ctx, center, {x:0, y:-END_OF_AXIS, z:0},!reversey);
 
 drawAxis(ctx, center, {x:0, y:0, z:END_OF_AXIS},reversez);
 drawAxis(ctx, center, {x:0, y:0, z:-END_OF_AXIS},!reversez);
}

function drawAxis(ctx, center /*(already projected)*/, endpoint, reversal){
  var end=projection(transform(endpoint));
  if (end.discard || center.discard){
    return;
  }
  ctx.save();
  if (!reversal){
    ctx.lineWidth=4;
  }
  else {
    ctx.lineWidth=2;
  }
  line(ctx, center.x, center.y, end.x, end.y);
  ctx.restore();
}

/**
 Connect opposing faces of the cube. There are 3 pairs of faces, connected separately.
 This only works if the projection of a straight line is also a straight line.
 Strictly speaking, this isn't true, and fails when the camera is very near (or within) the grid.
*/
function connectTheSensors1(ctx){
  ctx.save();
  ctx.strokeStyle = 'rgb(225,225,225)'; //grey
  for(var j=-GRID_SIZE;j<=GRID_SIZE;++j){
    for(var k=-GRID_SIZE;k<=GRID_SIZE;++k){
      //planes of constant x
      var startPoint = projection(transform({x:-END_OF_AXIS, y:j*SENSOR_SPACING, z:k*SENSOR_SPACING}));
      var endPoint =   projection(transform({x: END_OF_AXIS, y:j*SENSOR_SPACING, z:k*SENSOR_SPACING}));
      drawConnection(ctx,startPoint,endPoint);
      //planes of constant y
      startPoint = projection(transform({x:j*SENSOR_SPACING, y:-END_OF_AXIS, z:k*SENSOR_SPACING}));
      endPoint =   projection(transform({x:j*SENSOR_SPACING, y: END_OF_AXIS, z:k*SENSOR_SPACING}));
      drawConnection(ctx,startPoint,endPoint);
      //planes of constant z
      startPoint = projection(transform({x:j*SENSOR_SPACING, y:k*SENSOR_SPACING, z:-END_OF_AXIS}));
      endPoint =   projection(transform({x:j*SENSOR_SPACING, y:k*SENSOR_SPACING, z: END_OF_AXIS}));
      drawConnection(ctx,startPoint,endPoint);
    }
  }
  ctx.restore();
}

/** Connect each sensor to its nearest neighbours.*/
function connectTheSensors(ctx){
  ctx.save();
  ctx.strokeStyle = 'rgb(225,225,225)'; //grey
  for(var i=-GRID_SIZE;i<=GRID_SIZE;++i){
    for(var j=-GRID_SIZE;j<=GRID_SIZE;++j){
      for(var k=-GRID_SIZE;k<=GRID_SIZE;++k){
        //parallel to x-axis
        if (i+1<=GRID_SIZE){
          var startPoint = projection(transform({x:i*SENSOR_SPACING, y:j*SENSOR_SPACING, z:k*SENSOR_SPACING}));
          var endPoint =   projection(transform({x:(i+1)*SENSOR_SPACING, y:j*SENSOR_SPACING, z:k*SENSOR_SPACING}));
          drawConnection(ctx,startPoint,endPoint);
        }
        //parallel to y-axis
        if (j+1<=GRID_SIZE){
          var startPoint = projection(transform({x:i*SENSOR_SPACING, y:j*SENSOR_SPACING, z:k*SENSOR_SPACING}));
          var endPoint =   projection(transform({x:i*SENSOR_SPACING, y:(j+1)*SENSOR_SPACING, z:k*SENSOR_SPACING}));
          drawConnection(ctx,startPoint,endPoint);
        }
        //parallel to z-axis
        if (k+1<=GRID_SIZE){
          var startPoint = projection(transform({x:i*SENSOR_SPACING, y:j*SENSOR_SPACING, z:k*SENSOR_SPACING}));
          var endPoint =   projection(transform({x:i*SENSOR_SPACING, y:j*SENSOR_SPACING, z:(k+1)*SENSOR_SPACING}));
          drawConnection(ctx,startPoint,endPoint);
        }
      }
    }
  }
  ctx.restore();
}

function drawConnection(ctx, startPoint, endPoint){
  if(startPoint.discard || endPoint.discard){
    return;
  }
  line(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
}

function drawSensors(ctx){
  var color = currentSensorColor(); //depends on millis; need to ensure the same value for all sensors
  //loop thru base sensor positions, around the origin
  for (var i=-GRID_SIZE;i<=GRID_SIZE;++i){
    for (var j=-GRID_SIZE;j<=GRID_SIZE;++j){
      for (var k=-GRID_SIZE;k<=GRID_SIZE;++k){
        var sensor = {};
        sensor.x=i*SENSOR_SPACING;
        sensor.y=j*SENSOR_SPACING;
        sensor.z=k*SENSOR_SPACING;
        sensor=transform(sensor);
        sensor=projection(sensor);
        drawSensor(ctx,sensor,color);
      }  
    }
  }
}

function currentSensorColor(){
  //10 seconds fudge factor relates to translatet; ensures value is always 
  //positive and increasing with time
  var colorIdx = Math.round(secondsFromStart() + 10)%3;
  if (reverset){
    colorIdx = (SENSOR_COLORS.length - 1) - colorIdx;
  }
  return SENSOR_COLORS[colorIdx];
}

/**
 Sensors are drawn as a simpled fill circle, whose color cycles.
 This is chosen for its simplicity: if the sensor had more structure, then 
 you would have problems with 'overwriting' of one sensor by another: you would need to 
 decect depth somehow.
*/
function drawSensor(ctx,sensor,color){
  if (sensor.discard){
    return;
  }
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(sensor.x, sensor.y, 2, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

/** Rotation and 3 translations, but not the final projection. */
function transform(point){
  var result = rotate(point,rotation1,rotation2,rotation3); //first!
  result = translate(result);
  return result;
}

/** Consolidates 3 separate items, all implemented by a translation. */
function translate(sensor){
  var result = {};
  result.x=sensor.x + X0 + translatex + BOOST_STEP_SIZE*boostx*secondsFromStart();
  result.y=sensor.y + Y0 + translatey + BOOST_STEP_SIZE*boosty*secondsFromStart();
  result.z=sensor.z + Z0 + translatez + Z_BOOST_STEP_SIZE*boostz*secondsFromStart();
  return result;
}

function projection(point){
  var camera = {x:CAMERA_X0, y:CAMERA_Y0, z:CAMERA_Z0};
  return eyeprojection(point, camera);
  //return flatprojection(point);
}

/** Simply sets z=0, and uses z as the distance indicator. */
function flatprojection(point){
  var result = {};
  result.x=point.x
  result.y=point.y
  result.distance=point.z;
  return result;
}

/**
 Project a 3D position (x1,y1,z1) onto the xy plane, using a specific point of view (x0,y0,z0).
 The point of view is typically 'behind' the xy plane, in the +x+y-z quadrant, 
 and the position 1 is typically in the +x+y+z quadrant.
 The caller will usually want to do 2 things with the returned value:
    * exclude items outside of some rectangular range, corresponding to their 'viewport'; the viewport 
      will typically be centered on (x0,y0,0), directly under the point-of-view.
    * translate the center of the coordinates, to be in the middle of their 'viewport'.
    
 If the (x0,y0,z0) are not passed, then the point of view is taken to be infinity, and 
 the projected coords are the same as what's passed in, and with distance as y1.
 
 Returns an object having these properties:
   x - the projected x coord
   y - the projected y coord
   distance - a numeric indicator of distance from the camera eye
   discard - true if the point is behind the camera
*/
function eyeprojection(point, camera){
  //the coords of the intersection of the camera-to-point line with the xy plane
  var x;
  var y;
  //the distance from the camera to the point
  var dist;
  //degenerate cases where the point is behind the camera
  var discardIt=(point.z <= camera.z);
  if (arguments.length==1){
    x=x1;
    y=y1;
    dist=z1;
  }
  else {
    //find the vector from the camera to the point
    //no need to make this a unit vector; in addition, this form gives the distance
    var a=point.x-camera.x;
    var b=point.y-camera.y;
    var c=point.z-camera.z;
    //line equations, parameterized by t; t is in range 0..1
    //x = x0 + ta;
    //y = y0 + tb;
    //z = z0 + tc;
    //find param value where z is 0, on the xy plane
    //0 = z0 + t(z1-z0)
    var t=point.z/(point.z-camera.z); 
    //find the x,y values for the same value of the parameter t
    x=point.x+t*a;
    y=point.y+t*b;
    dist=Math.sqrt(a*a+b*b+c*c);
  }
  return {x:x, y:y, distance:dist, discard:discardIt};
}

/** The current system time in millis. */
function millis(){
 return (new Date()).getTime();
}

function secondsFromStart(){
  var now = millis();
  var result = (now-startTime)/1000 + translatet;
  return result;
}

/** 
 Return random, fixed 'stars' of various random sizes and positions, as background.
 Since the canvas is redrawn from scratch, these stars 
 must be generated once, and then remembered for later rendering.
*/
function randomStars(num){
  var result = new Array(num);
  for (var i=0; i<num; ++i){
    var randomx = random(WIDTH);
    var randomy = random(HEIGHT);
    var size = random(1);
    var star = new Object();
    star.x = randomx;
    star.y = randomy;
    star.size = size;
    result[i] = star;
  }
  return result;  
}

function status(ctx,msg,idx){
  text(ctx,msg,20,20*idx);
}
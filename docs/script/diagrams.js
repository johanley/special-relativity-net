
/** Diagrams. */

/* Examples of scale, translate, and rotate operations. */
function play(ctx /*160x160*/){
  ctx.fillRect(20,20,30,10); // the unaltered rect

  ctx.translate(120,120); // add these numbers to the xy
  ctx.scale(0.5,0.5); //multiply all xy by these numbers
  //ctx.translate(120,120); // add these numbers to the xy
  ctx.fillRect(20,20,30,10); // the unaltered rect
  
  //there's no built-in way to change the direction of the y-axis!
  //you need to do it yourself, using the canvas height: canvas.height - y
  
  //ctx.rotate(0.3); //rotate around the origin, clockwise
  
  //to rotate around a different point P, there are 3 steps
  //1. translate to P
  //2. rotate (around P)
  //3. draw using coords relative to P
  //the order of operations is significant
  //the successive calls are applied in reverse order!
  /*
  ctx.fillRect(20,20,30,10); // the unaltered rect
  ctx.save(); //save-restore to 'get back to normal' when finished
  ctx.translate(80,110);
  ctx.rotate(0.3);
  ctx.fillRect(20,20,30,10); //this will pass thru two transforms - first translate, then rotate
  ctx.restore();
  */

  //the setTransform method combines all 3, plus 1 - scale, rotate, translate, and skew
  /*  
  ctx.beginPath();
  ctx.arc(80,30,20,0,Math.PI*2,false);
  //ctx.arc(80,30,20,0,Math.PI*2,false);
  ctx.stroke();
  ctx.closePath();
  */
}

/**
 Basic space-time diagram with small axes and a light cone.
 ctx - drawing context from a 150*150 HTML5 canvas.
*/
function spacetime2dSmallAxes(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);
  //the light cone
  line(ctx,20,140,140,20);
  line(ctx,20,20,140,140);
}

function spacetime2dSmallAxesNoCone(ctx /*160x160*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
  //both t,x axes
  line(ctx,5,155,5,110);
  arrowUp(ctx,5,110);
  ctx.fillText('ct', 0, 103);
  line(ctx,5,155,50,155);
  arrowRight(ctx,50,155);
  ctx.fillText('x', 53, 155);
}

/** ct and x axes in the center of a canvas. */
function bigMoveableAxes(ctx,x,y,size,cttext,xtext){
  line(ctx,x-size,y,x+size,y);
  arrowRight(ctx,x+size,y);
  text(ctx,xtext,x+size+5,y+5);

  line(ctx,x,y+size,x,y-size);
  arrowUp(ctx,x,y-size);
  text(ctx,cttext,x-5,y-size-5);
}

function bigMoveableAxesWithLightCone(ctx,x,y,size,cttext,xtext){
  bigMoveableAxes(ctx,x,y,size,cttext,xtext);
  line(ctx,x-size,y+size,x+size,y-size);
  line(ctx,x-size,y-size,x+size,y+size);
}

/**
 Basic space-time diagram with axes; the history to be shown is passed by the caller.
 ctx - drawing context from a 150*150 HTML5 canvas.
 history - the history to be added 
 label - an identifier for the graphic, shown to the user
*/
function spacetime2d(ctx, history, label){
  ctx.font = '16px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('x', 63, 140); //axis labels
  ctx.fillText('t', 7, 80);
  if (label) {
   ctx.fillText(label, 5, 30);  //an identifier for the graphic
  }
  ctx.lineWidth = 2;
  //both axes
  line(ctx,10,90,10,140);
  line(ctx,10,140,60,140);
  arrowUp(ctx,10,90);
  arrowRight(ctx,60,140);
  ctx.beginPath();
  history(ctx);
  ctx.closePath();
}


/** Speed limit traffic sign. */
function speedLimit(ctx){
  ctx.font = '20px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPEED', 10, 12); 
  ctx.fillText('LIMIT', 14, 32);
  ctx.fillText('300,000', 2, 60);
  ctx.fillText('km/s', 20, 80);
}

function simplePath1(ctx /*200x40*/, include_tick_marks){
  ctx.font = '16px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  var a = 20;
  var b = 20;
  var tweak = 12;
  var width = 150;
  ctx.fillText('A', a, b+tweak); 
  ctx.fillText('B', a+width, b+tweak); 
  ctx.lineWidth = 2;
  line(ctx,a,b,a+width,b);
  spot(ctx,a,b,2);
  spot(ctx,a+width,b,2);
  ctx.lineWidth = 1;
  line(ctx,a+width,b,a+width+tweak, b);
  arrowRight(ctx, a+width+tweak, b);
  ctx.fillText('x', a+width+2*tweak, b);
  if (include_tick_marks){
    var ticks = [35,65,90,110,125,135,140,144];
    for(idx=0; idx<ticks.length; ++idx){
      line(ctx,a+ticks[idx],b-4,a+ticks[idx],b+4);
    }
  } 
}

function simpleSpaceTimePath(ctx /*200x200*/){
  ctx.font = '16px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  var a = 20;
  var b = 180;
  var tweak = 12;
  var width = 150;
  ctx.lineWidth = 1;
  line(ctx,a,b,a+width+tweak,b);
  arrowRight(ctx, a+width+tweak, b);
  ctx.fillText('x', a+width+2*tweak, b);
  spot(ctx,a,b,2);
  ctx.fillText('A', a, b+tweak);
  
  line(ctx,a,b,a,b-width-tweak);
  arrowUp(ctx, a, b-width-tweak);
  ctx.fillText('t', a, b-width-2*tweak);

  ctx.beginPath();  
  ctx.lineWidth = 2;
  var ticks = [35,65,90,110,125,135,140,144,144];
  //the hash-marks, raised in the air above the floor
  a = 20; //back to the origin
  b = 180;  
  var vstep = 18;
  ctx.moveTo(a,b); 
  for(idx=0; idx<ticks.length; ++idx){
    ctx.lineTo(a+ticks[idx],b-vstep*(idx+1)); 
  }
  ctx.stroke();
  ctx.closePath();
  spot(ctx,a+ticks[ticks.length-1],b-vstep*(ticks.length),2);
  ctx.fillText('B', 175, 15);
}



/** Pull the masking tape step-wise up into the air. */
function tapeInAir(ctx /*150x150*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('Raised off the floor', 25, 40); 
  ctx.fillText('Tape on the floor', 40, 150); 
  ctx.lineWidth = 2;
  //the starting point for the tape
  var a = 10;
  var b = 140;
  //the horizontal tape on the floor
  line(ctx,a,b,a+140,b);
  //the hash-marks on the tape
  var ticks = [60,87,103,117,126,131,135,139,140,141,141,141];
  for(idx=0; idx<ticks.length; ++idx){
    line(ctx,a+ticks[idx],b-2,a+ticks[idx],b+2);
  }
  //the hash-marks, raised in the air above the floor  
  var vstep = 10;
  ctx.moveTo(a,b); 
  for(idx=0; idx<ticks.length; ++idx){
    ctx.lineTo(a+ticks[idx],b-vstep*(idx+1)); 
  }
  ctx.stroke();
  ctx.closePath();
}

/** How the interval is broken down into delta-t and delta-d. */
function interval(ctx){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('\u0394t', 33, 50); 
  ctx.fillText('\u0394d', 68, 125); 
  ctx.fillText('A', 60, 10); 
  ctx.fillText('B', 110, 110); 
 
  ctx.lineWidth = 2;
  ctx.beginPath();
 
  //t,x axes
  ctx.fillText('x', 130, 140); //axis labels
  ctx.fillText('t', 7, 5);
  line(ctx,10,20,10,140);
  line(ctx,10,140,120,140);
  //arrow-heads on the axes
  arrowUp(ctx,10,20);
  arrowRight(ctx,120,140);
 
  //the delta-t indicator - vertical line
  line(ctx,35,10,35,40);
  line(ctx,35,60,35,110);
  //hash marks
  line(ctx,30,10,40,10);
  line(ctx,30,110,40,110);
  //arrows
  arrowUp(ctx,35,10);
  arrowDown(ctx,35,110);
 
  //the delta-d indicator - horizontal line
  line(ctx,50,125,65,125);
  line(ctx,85,125,100,125);
  //hash marks
  line(ctx,50,120,50,130);
  line(ctx,100,120,100,130);
  //arrows
  arrowLeft(ctx,50,125);
  arrowRight(ctx,100,125);
  
  //dots for A and B
  ctx.beginPath(); //if this is not here, the previous arrow is an unfilled triangle; why?
  ctx.rect(50, 10, 1, 1);
  ctx.stroke();
  ctx.rect(100, 110, 1, 1);
  ctx.stroke();
  
  //these should really be dashed lines
  line(ctx, 50, 15, 50, 110);
  line(ctx, 50, 110, 95, 110);
}

/** Regions near an event where the value of the interval has the same sign. */
function signOfInterval(ctx /*200x200*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('A',90,80); 
  ctx.lineWidth = 1;
  //both t,x axes
  ctx.fillText('x', 192, 100); //axis labels
  ctx.fillText('ct', 95, 4);
  line(ctx,10,100,190,100);
  line(ctx,100,10,100,190);
  arrowUp(ctx,100,10);
  arrowRight(ctx,190,100);
  //the light cone
  ctx.lineWidth = 3;
  line(ctx,20,180,180,20);
  line(ctx,20,20,180,180);
  ctx.fillText('0', 10, 14); 
  ctx.fillText('0', 184, 14); 
  ctx.fillText('0', 184, 184); 
  ctx.fillText('0', 8, 188); 
  //the + and - signs scattered over the diagram
  ctx.fillText('+', 77, 48); 
  ctx.fillText('+', 115, 48); 
  ctx.fillText('+', 77, 145); 
  ctx.fillText('+', 115, 145); 
  ctx.fillText('-', 50,85); 
  ctx.fillText('-', 50,115); 
  ctx.fillText('-', 140,85); 
  ctx.fillText('-', 140,115); 
}

/** The three regions around an event, in color. */
function futurePastElsewhere(ctx){
  myFont(ctx)
  ctx.textBaseline = 'middle';
  ctx.fillText('A', 100,95); 

  //4 triangles
  ctx.fillStyle = 'rgb(200,200,200)'; //grey
  ctx.strokeStyle = 'rgb(200,200,200)'; //grey
  triangle(ctx,20,0,20,180,110,90); //left
  triangle(ctx,200,0,200,180,110,90); //right
  ctx.fillStyle = 'rgb(235,221,143)';
  ctx.strokeStyle = 'rgb(235,221,143)';
  triangle(ctx,20,0,200,0,110,90); //future
  //ctx.fillStyle = 'rgb(100,200,200)';
  //ctx.strokeStyle = 'rgb(100,200,200)';
  triangle(ctx,20,180,110,90,200,180); //past
  
  //ct, x axes in the bottom left
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgb(0,0,0)'; //black
  ctx.strokeStyle = 'rgb(0,0,0)'; //black
  ctx.fillText('x', 55, 190); //axis labels
  ctx.fillText('ct', 2, 140);
  line(ctx,10,190,50,190);
  line(ctx,10,190,10,150);
  //arrow-heads on the axes
  arrowUp(ctx,10,150);
  arrowRight(ctx,50,190);
  
  //light cone
  ctx.lineWidth = 2;
  line(ctx,20,180,200,0);
  line(ctx,20,0,200,180);
  ctx.fillText('0', 25, 20); 
  ctx.fillText('0', 184, 23); 
  ctx.fillText('0', 28, 154); 
  ctx.fillText('0', 182, 154); 

  ctx.fillText('A', 106, 78); 
  ctx.fillText('Future', 88, 30); 
  ctx.fillText('(+)', 100, 53); 
  ctx.fillText('(+)', 100, 120); 
  ctx.fillText('(-)', 45, 110); 
  ctx.fillText('(-)', 170, 70); 
  ctx.fillText('Past', 93, 150); 
  ctx.fillText('Elsewhere',25, 90); 
  ctx.fillText('Elsewhere',130, 90); 
}

/** Basic 2.5D light cone. */
function lightCone(ctx){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('Light Cone',15,35); 
  ctx.fillText('ct', 96,4); 
  ctx.fillText('y', 20,137); 
  ctx.fillText('x', 177,137); 
  ctx.fillText('A', 77,110); 
  
  //t,x, and y axes
  line(ctx,113,112,30,135);
  line(ctx,88,112,170,135);
  line(ctx,100,10,100,73);
  arrowUp(ctx,100,10);
  line(ctx,163,128,170,135);
  line(ctx,163,138,170,135);
  line(ctx,35,127,30,135);
  line(ctx,37,139,30,135);
  
  //light cone
  ctx.lineWidth = 2;
  line(ctx,60,170,140,60);
  line(ctx,60,60,140,170);
  //ellipse on the top - a distorted circle
  ctx.save(); //stack - save the current ctx for later use
  ctx.scale(1, 0.4); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(100,142,40, 0, Math.PI*2, false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); //go back to the previous set of context properties
  //half-ellipse on the bottom
  ctx.save(); 
  ctx.scale(1, 0.4); 
  ctx.beginPath();
  ctx.arc(100,424,40, 0, Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/** History has to remain inside the light cone. */
function historyStaysInLightCone(ctx /*160x160*/){
  spacetime2dSmallAxes(ctx);  
  ctx.fillText('History', 55, 25); 
  //the history
  ctx.lineWidth = 3;
  line(ctx,80,80,105,20);
  ctx.beginPath();
  ctx.moveTo(80, 80);
  ctx.quadraticCurveTo(68, 100, 90, 140);
  ctx.stroke();
  ctx.closePath();  
}

/* Hyperbola in 2D with a positive interval. */
function surfaceConstantPositiveInterval(ctx /*160x160*/){
  spacetime2dSmallAxes(ctx);  
  ctx.fillText('Time-like', 50, 10); 
  ctx.fillText('A', 75, 68); 
  //the hyperbolas in the future and past
  ctx.lineWidth = 3;
  graphHyperbolaUp(ctx,80,80,-60,60,1000);
  graphHyperbolaDown(ctx,80,80,-60,60,1000);
}

/* Hyperbola in 2D with a negative interval. */
function surfaceConstantNegativeInterval(ctx /*160x160*/){
  spacetime2dSmallAxes(ctx);  
  ctx.fillText('Space-like', 48, 10); 
  ctx.fillText('A', 75, 68); 
  //the hyperbolas in the elsewhere
  ctx.lineWidth = 3;
  graphHyperbolaRight(ctx,80,80,-60,60,1000);
  graphHyperbolaLeft(ctx,80,80,-60,60,1000);
}

/** 2.5D hyperbolic shell for a time-like interval. */
function hyperbolicShellPositiveInterval(ctx /*160x160*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('ct',75,4); 
  ctx.fillText('y',1,98); 
  ctx.fillText('x',153,95); 
  ctx.fillText('A',69,68); 
  ctx.fillText('Time-like',50,151); 
  
  //t,x,and y axes
  line(ctx,97,72,10,95); //y on left
  line(ctx,63,72,150,95); //x on right
  line(ctx,80,10,80,42); //t (with gap for the shell
  line(ctx,80,59,80,103); //t
  line(ctx,80,137,80,145); //t
  arrowUp(ctx,80,10); //t
  line(ctx,147,88,150,95); //x
  line(ctx,144,100,150,95);
  line(ctx,14,87,10,95); //y
  line(ctx,16,101,10,95);
  
  //top shell: an ellipse plus a hyperbola (no fancy projection)
  ctx.lineWidth = 3;
  ctx.save(); //stack - save the current ctx for later use
  ctx.scale(1, 0.3); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(80,100,41,0,Math.PI*2,false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); //go back to the previous set of context properties
  graphHyperbolaUp(ctx,80,80,-40,40,500);
  
  //bottom shell
  ctx.save(); //stack - save the current ctx for later use
  ctx.scale(1, 0.3); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(80,417,41,0,Math.PI,false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); //go back to the previous set of context properties
  graphHyperbolaDown(ctx,80,80,-40,40,500);
}

/** 2.5D hyperbolic shell for a space-like interval. */
function hyperbolicShellNegativeInterval(ctx /*160x160*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('ct',75,4); 
  ctx.fillText('y',1,98); 
  ctx.fillText('x',153,95); 
  //ctx.fillText('A',76,80); 
  ctx.fillText('Space-like',50,154); 
  
  //t,x,and y axes
  //line(ctx,97,72,10,95); //y on left
  line(ctx,65,80,10,95); //y on left
  //line(ctx,63,72,150,95); //x on right  
  line(ctx,97,81,150,95); //x on right
  line(ctx,80,10,80,52); //t (with gap for the shell
  line(ctx,80,130,80,145); //t
  arrowUp(ctx,80,10); //t
  line(ctx,147,88,150,95); //x
  line(ctx,144,100,150,95);
  line(ctx,14,87,10,95); //y
  line(ctx,16,101,10,95);  
  
  //top shell: an ellipse plus a hyperbola (no fancy projection)
  ctx.lineWidth = 3;
  ctx.save(); //stack - save the current ctx for later use
  ctx.scale(1, 0.3); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(80,135,41,0,Math.PI*2,false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); //go back to the previous set of context properties
  graphHyperbolaRight(ctx,80,80,-40,40,300);
  
  //bottom shell
  ctx.save(); //stack - save the current ctx for later use
  ctx.scale(1, 0.3); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(80,395,41,0,Math.PI,false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); //go back to the previous set of context properties
  graphHyperbolaLeft(ctx,80,80,-40,40,250);
}

/* Beta=0, beta=1, using ct and x axes. */
function preferCt(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth = 3;
  line(ctx,30,140,30,20);
  line(ctx,30,140,150,20);
  ctx.fillText('\u03B2=0', 20, 7); 
  ctx.fillText('\u03B2=1', 137, 7); 
  ctx.fillText('45\u00B0', 36, 105); 
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.arc(30, 140, 20, 1.5*Math.PI, 7*Math.PI/4);
  ctx.stroke();
  ctx.closePath();
}

/* How to graph an intermediate value of beta, between 0 and 1. */
function intermediateBeta(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=3;
  line(ctx,30,140,30,20);
  line(ctx,30,140,150,20);
  ctx.lineWidth=1;
  line(ctx,30,20,150,20);
  ctx.fillText('\u03B2=0', 20, 7); 
  ctx.fillText('\u03B2=1', 137, 7); 
  ctx.fillText('\u03B2=0.3', 62, 45); 
  ctx.fillText('A', 18, 142); 
  ctx.fillText('B', 18, 23); 
  ctx.fillText('C', 152, 23); 
  for(idx=0;idx<=10;++idx){
    tickMarkVertical(ctx,30+12*idx,20,3);
  }
  //ctx.lineWidth=1;
  line(ctx,30,140,66,20);
}

/* Basic idea of how a frame of reference is a grid of meter sticks and clocks. */
function measuringGrid(ctx /*160x160*/){
  myFont(ctx);
  ctx.lineWidth=1;
  //both t,x axes
  line(ctx,5,155,5,110);
  arrowUp(ctx,5,110);
  ctx.fillText('y', 2, 103);
  line(ctx,5,155,50,155);
  arrowRight(ctx,50,155);
  ctx.fillText('x', 53, 157);
  for(idx=20;idx<=140;idx=idx+20){
    line(ctx,idx,20,idx,140); //verticals
    line(ctx,20,idx,140,idx); //horizontals
  }
  //the junctions 
  for(i=20;i<=140;i=i+20){
    for(j=20;j<=140;j=j+20){
      //console.log("i: " + i + " j:" + j);
      ctx.beginPath();
      ctx.arc(i, j, 2, 0, 2 * Math.PI, false);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
    }
  }
  ctx.fillText('2D grid, or lattice', 30, 10); 
}

/* Basic idea of how a frame of reference is a grid of meter sticks and clocks. */
function measuringGrid3d(ctx /*160x160*/){
  myFont(ctx);
  //both t,x axes
  line(ctx,5,155,5,110);
  arrowUp(ctx,5,110);
  ctx.fillText('y', 2, 103);
  line(ctx,5,155,50,155);
  arrowRight(ctx,50,155);
  ctx.fillText('x', 53, 157);
  line(ctx,5,155,27,150);
  ctx.fillText('z', 29, 150);
  line(ctx,24,146,27,150);
  line(ctx,26,154,27,150);
  
  ctx.textBaseline = 'middle';
  ctx.fillText('3D grid, or lattice', 30,10); 
  var step=55;
  var x0=180;
  var y0=-200;
  var z0=90;
  var zconnector = new Object();
  var basex=15;
  var basey=25;
  for (var x=0;x<=2;++x){
    for (var y=0;y<=2;++y){
      for (var z=0;z<=2;++z){
        var projection = projectionDrawingXZPlane(x*step,y*step,z*step,x0,y0,z0);
        //var projection = projectionDrawingXZPlane(x*step,y*step,z*step);
        //console.log("x:"+ projection.x + " z:" + projection.z + " d:" + projection.distance);
        ctx.beginPath();
        ctx.arc(projection.x+basex, projection.z+basey, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        //ctx.fillText(''+x+y+z,projection.x+10, projection.z+30);
        manageConnections(zconnector, projection, z, basex, basey);
      }
    }
  }
  var yconnector = new Object();
  for (var x=0;x<=2;++x){
    for (var z=0;z<=2;++z){
      for (var y=0;y<=2;++y){
        var projection = projectionDrawingXZPlane(x*step,y*step,z*step,x0,y0,z0);
        manageConnections(yconnector, projection, y, basex, basey);
      }
    }
  }
  var xconnector = new Object();
  for (var y=0;y<=2;++y){
    for (var z=0;z<=2;++z){
      for (var x=0;x<=2;++x){
        var projection = projectionDrawingXZPlane(x*step,y*step,z*step,x0,y0,z0);
        manageConnections(xconnector, projection, x,  basex, basey);
      }
    }
  }
}

function manageConnections(connector, projection, idx, basex, basey){
  if (idx==0){
    startToConnect(connector, projection, basex, basey);
  }
  else if (idx==2){
    connectTheDots(connector, projection, basex, basey);
  }
}
function startToConnect(connector, projection, basex, basey){
  connector.startz=projection.z+basey;
  connector.startx=projection.x+basex;
}
function connectTheDots(connector, projection, basex, basey){
  ctx.beginPath();
  ctx.moveTo(projection.x+basex, projection.z+basey);
  ctx.lineTo(connector.startx, connector.startz);
  ctx.stroke();
  ctx.closePath();
}

/* Time dilation with a human clock. */
function skippingRopeorig(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.fillText('Spacecraft', 45, 10); 
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 18, 20); 
  ctx.lineWidth=3;
  line(ctx,30,20,30,140);
}

/* Time dilation with a human clock. */
function skippingRopeSpacecraft(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.fillText('\u03B2=0', 20, 60); 
  ctx.fillText('Zoomer', 8, 10); 
  ctx.fillText('Grid', 18, 25); 
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 18, 80); 
  ctx.lineWidth=3;
  spot(ctx,30,140,2);
  spot(ctx,30,80,2);
}
function skippingRopeEarth(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.fillText('Home Base', 15, 10); 
  ctx.fillText('Grid', 34, 24); 
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 135, 35); 
  ctx.fillText('\u03B2=0.87', 115, 7); 
  ctx.lineWidth=3;
  spot(ctx,30,140,2);
  spot(ctx,135,20,2);
}
function skippingRopeBoth(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=3;
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 133, 33); 
  ctx.fillText('Both', 110, 130); 
  ctx.fillText('Grids', 110, 145); 
  //line(ctx,30,140,135,20);//homebase
  spot(ctx,30,140,2);
  spot(ctx,135,20,2);
  ctx.fillText('B', 18, 80); 
  //line(ctx,30,140,30,80);//zoomer
  spot(ctx,30,80,2);
  //tick marks and the beta-scale
  ctx.lineWidth=1;
  line(ctx,30,20,150,20);
  ctx.fillText('\u03B2=0', 20, 7); 
  ctx.fillText('\u03B2=0.87', 110, 7); 
  for(idx=0;idx<=10;++idx){
    tickMarkVertical(ctx,30+12*idx,20,3);
  }
  //surface of constant interval
  graphHyperbolaUp(ctx,30,138,0,104,3300);
}
function skippingRopeDeltaTs(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=3;
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 133, 33); 
  //line(ctx,30,140,135,20);//homebase
  ctx.fillText('B', 18, 80); 
  //line(ctx,30,140,30,80);//zoomer
  spot(ctx,30,140,2);
  spot(ctx,135,20,2);
  spot(ctx,30,80,2);
  
  ctx.lineWidth=1;
  //surface of constant interval
  graphHyperbolaUp(ctx,30,138,0,104,3300);
  //delta-ts
  line(ctx,100,140,100,80);//zoomer
  tickMarkHorizontal(ctx,100,140,3);
  tickMarkHorizontal(ctx,100,80,3);
  ctx.fillText('\u0394ct', 92, 110); 
  line(ctx,146,140,146,20);//homebase
  tickMarkHorizontal(ctx,146,140,3);
  tickMarkHorizontal(ctx,146,20,3);
  ctx.fillText('\u0394ct', 137, 110); 
}
function skippingRopeVariousSpeeds(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=1;
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 139, 33); 
  line(ctx,30,140,135,20);//homebase
  ctx.fillText('B', 25, 70); 
  spot(ctx,30,140,3);
  spot(ctx,135,20,3);
  spot(ctx,30,80,3);
  //line(ctx,30,140,30,80);//zoomer
  //tick marks and the beta-scale
  ctx.lineWidth=1;
  line(ctx,30,20,150,20);
  ctx.fillText('\u03B2',2, 7); 
  ctx.fillText('0.0',20, 7); 
  ctx.fillText('0.5', 80, 7); 
  ctx.fillText('1.0', 140, 7); 
  for(idx=0;idx<=10;++idx){
    tickMarkVertical(ctx,30+12*idx,20,3);
  }
  //surface of constant interval
  graphHyperbolaUp(ctx,30,138,0,104,3300);
  ctx.lineWidth=1;
  //history for beta=0.3
  line(ctx,30,140,66,20);
  //history for beta=0.6
  line(ctx,30,140,102,20);
  ctx.lineWidth=1;
  line(ctx,30,140,48,78);
  line(ctx,30,140,75,65);
  ctx.fillText('gap increases',70,110); 
  ctx.fillText('as \u03B2 increases',70,125); 
  ctx.lineWidth=1;
  //show the t-level, and the various discrepancies
  line(ctx,0,80,150,80); //show the t-level
  line(ctx,48,78,48,80); 
  line(ctx,75,65,75,80); 
  line(ctx,135,20,135,80); 
  spot(ctx,48,78,3);
  spot(ctx,75,65,3);
}

/* Basic graph of the warp factor. */
function gammaWarpFactor(ctx /*160x160*/){
  ctx.scale(2,2);
  ctx.fillText('Warp Factor',55,80); 
  //the x-axis
  line(ctx,20,140,140,140); 
  for(idx=0;idx<=10;++idx){
    tickMarkVertical(ctx,20+12*idx,140,3);
  }
  ctx.fillText('0',16,155); 
  ctx.fillText('1',138,155); 
  //the y-axis
  line(ctx,20,20,20,140); 
  for(idx=0;idx<=6;++idx){
    tickMarkHorizontal(ctx,20,140-20*idx,3);
    ctx.fillText('' + idx,7,140-20*idx + 3); 
  }
  //graph the curve of gamma as a function of beta
  //x: 0..1  y: 0..5
  var gammaFn = function(beta){
    return 1/(Math.sqrt(1-beta*beta));
  }
  //ctx.lineWidth=3;
  ctx.beginPath();
  var startx = 20;
  var starty = 120;
  var plot = function(ctx, beta) {
    var gamma = gammaFn(beta);
    var x = (startx+120*beta);
    var y = 160-(20+20*gamma);
    ctx.lineTo(x,y);
    //console.log('b: ' + beta + ' g:' + gamma + ' x:' + x + ' y:' + y);
  }
  ctx.moveTo(20,120);
  //divide the plot into two parts
  for (var beta=0; beta<0.90; beta=beta+0.1){
    plot(ctx, beta);
  }
  for (var beta=0.90; beta<=0.981; beta=beta+0.01){
    plot(ctx, beta);
  }
  ctx.stroke();
  ctx.closePath();
  arrowUp(ctx,137,39);
  ctx.font = '14px sans-serif';
  ctx.fillText('\u03B2',150,145);
  greekGamma(15,18,10);
  //ctx.fillText('\u0393',18,10); 
}

/* 
 A tool for relating beta, gamma, and the interval. 
 Large, and meant to be printed off. Three times 
 the size of 160x160.
*/
function betaIntervalGamma(ctx, zoom){
  ctx.scale(zoom,zoom);
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=1;
  line(ctx,30,140,150,20);//light cone
  //line(ctx,30,140,135,20);//homebase
  //line(ctx,30,140,30,80);//zoomer
  line(ctx,30,140,30,20);//zoomer
  //tick marks and the beta-scale
  line(ctx,30,20,150,20);
  ctx.fillText('\u03B2', 87, 7); 
  for(idx=0;idx<=20;++idx){
    var tickSize = idx % 2 ? 2 : 4;
    tickMarkVertical(ctx,30+6*idx,20,tickSize);
  }
  //tick marks for finding gamma
  greekGamma(15, 14, 67);
  for(idx=0;idx<=30;++idx){
    var tickSize = idx % 10 ? 2 : 4;
    tickMarkHorizontal(ctx,30,20+idx*3,tickSize);
  }
  //surface of constant interval
  graphHyperbolaUp(ctx,30,140,0,117,900); //
}

/* Small gamma renders poorly in sans-serif fonts. */
function greekGamma(size, x, y){
  ctx.save();
  ctx.font = size + "px Times New Roman";
  ctx.fillText('\u03B3', x, y); 
  ctx.restore();
}
function greek(size, x, y, letters){
  ctx.save();
  ctx.font = size + "px Times New Roman";
  ctx.fillText(letters, x, y); 
  ctx.restore();
}

function betaIntervalGammaExample(ctx, zoom){
  betaIntervalGamma(ctx, zoom);
  ctx.lineWidth=2;
  line(ctx,30,140,120,20);
  line(ctx,30,95,64,95);
  ctx.fillText('\u03B2=0.75', 100,100); 
  greekGamma(15,100,120);
  //ctx.fillText('\u0393=1.50', 100,120);
  ctx.fillText('=1.50', 107,120);
}

function timeDilationCompareTwoGrids(ctx){
 var r = 3;
 var offset = 8;
 var separation = 40;
 var y = 20;
 
 line(ctx,10,y,140,y);
 arrowLeft(ctx, 10,y); 
 
 textCtr(ctx,'X',90,y-offset); 
 circle(ctx,90,y,r);
 
 textCtr(ctx,'Y',90+separation,y-offset); 
 circle(ctx,130,y,r);

 y = 40;
 textCtr(ctx,'A',90,y+2*offset); 
 spot(ctx,90,y,r);
 textCtr(ctx,'B',90-separation,y+2*offset); 
 spot(ctx,90-separation,y,r);
 
 textCtr(ctx, '(B-A)/\u0394X', 90+2.1*separation, y);

 y = 110;
 textCtr(ctx,'X',10+separation,y-offset); 
 spot(ctx,10+separation,y,r);
 textCtr(ctx,'Y',10+2*separation,y-offset); 
 spot(ctx,10+2*separation,y,r);

 y = 130;
 line(ctx,0,y,140,y);
 arrowRight(ctx,140,y); 
 
 textCtr(ctx,'B',10,y+2*offset); 
 circle(ctx,10,y,r);
 
 textCtr(ctx,'A',10+separation,y+2*offset); 
 circle(ctx,10+separation,y,r);
 
 textCtr(ctx, '(Y-X)/\u0394A', 90+2.1*separation, y);
}


function timeDilationMeasuredInTheLab(ctx){
 var r = 3;
 var offset = 8;
 var separation = 40;
 var y = 20;
 
 line(ctx,10,y,140,y);
 arrowLeft(ctx, 10,y); 
 
 textCtr(ctx,'X',90,y-offset); 
 circle(ctx,90,y,r);

 y = 40;
 textCtr(ctx,'A',90,y+2*offset); 
 spot(ctx,90,y,r);
 textCtr(ctx,'B',90-separation,y+2*offset); 
 spot(ctx,90-separation,y,r);
 
 textCtr(ctx, '(B-A)/\u0394X', 90+2.1*separation, y);
}


function movingSensor(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=1;
  ctx.fillText('Zoomer', 5, 60); 
  ctx.fillText('Home', 110, 60); 
  ctx.fillText('Base', 110, 76); 
  ctx.fillText('A', 18, 140); 
  ctx.fillText('B', 133, 33); 
  line(ctx,30,140,135,20);//homebase
  //ticks for home base
  for(idx=0;idx<=3;++idx){
    spot(ctx,30+35*idx,140-(40*idx),2);
  }
  ctx.fillText('B', 18, 80); 
  line(ctx,30,140,30,80);//zoomer
  //ticks for zoomer
  for(idx=0;idx<=3;++idx){
    spot(ctx,30,80+20*idx,2);
  }
  //tick marks and the beta-scale
  line(ctx,30,20,150,20);
  ctx.fillText('\u03B2=0', 20, 7); 
  ctx.fillText('\u03B2=0.87', 110, 7); 
  for(idx=0;idx<=10;++idx){
    tickMarkVertical(ctx,30+12*idx,20,3);
  }
  //surface of constant interval
  graphHyperbolaUp(ctx,30,138,0,104,3300);
}


function maxAgeing(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);  
  ctx.lineWidth=1;
  ctx.fillText('A', 17, 140); 
  ctx.fillText('B', 17, 20); 
  line(ctx,30,140,30,20);
  spot(ctx,30,140,2);
  spot(ctx,30,20,2);
}
function maxAgeing1(ctx /*160x160*/){
  maxAgeing(ctx);
  ctx.lineWidth=2;
  line(ctx,30,140,30,20);
  ctx.fillText('Parent', 10, 7); 
}
function maxAgeing2(ctx /*160x160*/){
  maxAgeing(ctx);
  ctx.fillText('Child', 10, 7); 
  ctx.lineWidth=2;
  line(ctx,30,140,35,120);
  line(ctx,35,120,35,115);
  line(ctx,35,115,30,100);
  line(ctx,30,100,25,80);
  line(ctx,25,80,25,55);
  line(ctx,25,55,33,33);
  line(ctx,33,33,30,20);
}
function maxAgeing3(ctx /*160x160*/){
  maxAgeing(ctx);
  ctx.fillText('Child', 10, 7); 
  ctx.lineWidth=2;
  line(ctx,30,140,40,100);
  line(ctx,40,100,40,60);
  line(ctx,40,60,30,20);
}

function transformGrid(ctx /*160x160*/){
  ctx.fillRect(20,20,30,10); // the unaltered rect
  ctx.translate(120,120); // add these numbers to the xy
  ctx.scale(0.5,0.5); //multiply all xy by these numbers
  ctx.fillRect(20,20,30,10); // the unaltered rect
}

/** The two grids for which the Lorentz transform is applicable. */
function lorentzGrids1(ctx){
  myFont(ctx);
  text(ctx,"Time not 0", 10,10);
  text(ctx,"G",30,75);
  
  moveableAxes(ctx,20,140,100,"ct","x");
  var primeGridColor = "rgb(255,0,0)";
  
  ctx.fillStyle = primeGridColor;
  ctx.strokeStyle = primeGridColor;
  text(ctx,"G'",150,75);
  moveableAxes(ctx,140,140,80,"ct'","x'");
  
  line(ctx,120,100,160,100);
  arrowRight(ctx,160,100);
  arrowLeft(ctx,120,100);
  spot(ctx,140,100,2);
  text(ctx,"\u03B2>0",163,104);
  text(ctx,"\u03B2<0",92,104);
}
function lorentzGrids2(ctx){
  myFont(ctx);
  text(ctx,"Time = 0", 30,10);
  
  moveableAxes(ctx,60,140,100,"ct","x");
  var primeGridColor = "rgb(255,0,0)";
  
  ctx.fillStyle = primeGridColor;
  ctx.strokeStyle = primeGridColor;
  moveableAxes(ctx,60,140,80,"ct'","x'");
  
  line(ctx,40,100,80,100);
  arrowRight(ctx,80,100);
  arrowLeft(ctx,40,100);
  spot(ctx,60,100,2);
  text(ctx,"\u03B2>0",83,104);
  text(ctx,"\u03B2<0",12,104);
}

/** ct and x axes */
function moveableAxes(ctx,x,y,size,cttext,xtext){
  line(ctx,x,y,x+size,y);
  arrowRight(ctx,x+size,y);
  text(ctx,xtext,x+size+5,y+5);

  line(ctx,x,y,x,y-size);
  arrowUp(ctx,x,y-size);
  text(ctx,cttext,x-5,y-size-5);
}

/** Show the diff between dilation and contraction. */
function dilateVersusContract1(ctx){
  myFont(ctx);
  var cx=85;
  var cy=85;
  var size=65;
  var squaredInterval=1600;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  textCtr(ctx,"Two clock ticks",cx,cy*1.87);
  textCtr(ctx,"G'",cx-36,22);
  textCtr(ctx,"G",cx+8, cy-20);
  spot(ctx,cx,cy,3);
  spot(ctx,cx,cy-0.61*size,3);
  spot(ctx,cx-0.61*size,cy-0.86*size,3);
  thickLine(ctx, cx, cy, cx, cy-0.61*size);
  thickLine(ctx, cx, cy, cx-0.61*size,cy-0.86*size);
  
  ctx.strokeStyle = 'rgb(0,0,255)';
  graphHyperbolaUp(ctx, cx, cy, -size, +size, squaredInterval);
}

/** Show the diff between dilation and contraction. */
function dilateVersusContract2(ctx){
  myFont(ctx);
  var cx=85;
  var cy=85;
  var size=65;
  var squaredInterval=1600;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  textCtr(ctx,"Stick size",cx,cy*1.87);
  textCtr(ctx,"Lab",1.29*cx,1.15*cy);
  textCtr(ctx,"Rest",cx+72, cy-0.40*size);
  spot(ctx,cx,cy,3);
  spot(ctx,cx+0.61*size,cy,3);
  spot(ctx,cx+0.86*size,cy-0.61*size,3);
  thickLine(ctx, cx, cy, cx+0.61*size,cy);
  thickLine(ctx, cx, cy, cx+0.86*size,cy-0.61*size);
  
  ctx.strokeStyle = 'rgb(0,0,255)';
  graphHyperbolaRight(ctx, cx, cy, -size, +size, squaredInterval);
}




/** Flow of events during a boost, along the hyperbola of constant interval. */
function lorentzFlow1(ctx){
  myFont(ctx);
  var cx=85;
  var cy=85;
  var size=65;
  var squaredInterval=1600;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  ctx.strokeStyle = 'rgb(0,0,255)';
  graphHyperbolaUp(ctx, cx, cy, -size, +size, squaredInterval);
  graphHyperbolaDown(ctx, cx, cy, -size, +size, squaredInterval);
  graphHyperbolaRight(ctx, cx, cy, -size, +size, squaredInterval);
  graphHyperbolaLeft(ctx, cx, cy, -size, +size, squaredInterval);
  arrowLeft(ctx,cx,cy-Math.sqrt(squaredInterval));
  arrowRight(ctx,cx,cy+Math.sqrt(squaredInterval),cy);
  arrowDown(ctx,cx+Math.sqrt(squaredInterval),cy);
  arrowUp(ctx,cx-Math.sqrt(squaredInterval),cy);
  text(ctx,"\u03B2>0",40,15);
}
function lorentzFlow2(ctx){
  myFont(ctx);
  var cx=85;
  var cy=85;
  var size=65;
  var squaredInterval=1600;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  ctx.strokeStyle = 'rgb(0,0,255)';
  graphHyperbolaUp(ctx, cx, cy, -size, +size, squaredInterval);
  graphHyperbolaDown(ctx, cx, cy, -size, +size, squaredInterval);
  graphHyperbolaRight(ctx, cx, cy, -size, +size, squaredInterval);
  graphHyperbolaLeft(ctx, cx, cy, -size, +size, squaredInterval);
  arrowRight(ctx,cx,cy-Math.sqrt(squaredInterval));
  arrowLeft(ctx,cx,cy+Math.sqrt(squaredInterval),cy);
  arrowUp(ctx,cx+Math.sqrt(squaredInterval),cy);
  arrowDown(ctx,cx-Math.sqrt(squaredInterval),cy);
  text(ctx,"\u03B2<0",40,15);
}

/** Geometrical construction for a boosted grid. */
function boostAxes1(ctx){
  myFont(ctx);
  var cx=100;
  var cy=100;
  var size=85;
  var squaredInterval=1600;
  var beta=0.50;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  text(ctx,"\u03B2=+0.5",30,15);
  addDotsToXLine(ctx,5,1,15,cx,cy,0);
  addDotsToXLine(ctx,5,1,15,cx,cy,-1);

  ctx.save();
  ctx.strokeStyle="rgb(255,0,0)";
  ctx.fillStyle="rgb(255,0,0)";
  movingGridCtLine(ctx,beta,cx,cy,size);
  movingGridXLine(ctx,beta,cx,cy,size);
  text(ctx,"ct'",135,10);
  text(ctx,"x'",188,60);
  var spotx=cx+55;
  var spoty=cy-75;
  //these are just done by eye:
  line(ctx,spotx,spoty,cx+32,cy-64);
  line(ctx,spotx,spoty,cx+24,cy-12);
  var warp = gamma(beta);
  addDotsToXLine(ctx,5,1,15*gamma(beta),cx,cy,-beta);
  addDotsToCtLine(ctx,5,1,15*gamma(beta),cx,cy,-beta);
  
  arcAroundOrigin(ctx,cx,cy,35,270,297);
  arcAroundOrigin(ctx,cx,cy,35,333,359);
  
  ctx.restore();
  spot(ctx,spotx,spoty,2);
}

function arcAroundOrigin(ctx,cx,cy,r,degStart,degEnd){
  ctx.moveTo(cx,cy);
  ctx.beginPath();
  ctx.arc(cx,cy,r,radians(degStart),radians(degEnd),false);
  ctx.stroke();
  ctx.closePath();
}

/** Geometrical construction for a boosted grid. */
function boostAxes2(ctx){
  myFont(ctx);
  var cx=100;
  var cy=100;
  var size=85;
  var squaredInterval=1600;
  var beta=-0.50;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  text(ctx,"\u03B2=-0.5",130,13);
  addDotsToXLine(ctx,5,1,15,cx,cy,0);
  addDotsToXLine(ctx,5,1,15,cx,cy,-1);

  ctx.save();
  ctx.strokeStyle="rgb(255,0,0)";
  ctx.fillStyle="rgb(255,0,0)";
  movingGridCtLine(ctx,beta,cx,cy,size);
  movingGridXLine(ctx,beta,cx,cy,size);
  text(ctx,"ct'",50,10);
  text(ctx,"x'",188,148);
  var spotx=cx+25;
  var spoty=cy-40;
  //these are just done by eye:
  line(ctx,spotx,spoty,cx-37,cy-73);
  line(ctx,spotx,spoty,cx+73,cy+37);
  var warp = gamma(beta);
  addDotsToXLine(ctx,5,1,15*gamma(beta),cx,cy,-beta);
  addDotsToCtLine(ctx,5,1,15*gamma(beta),cx,cy,-beta);
  
  arcAroundOrigin(ctx,cx,cy,35,0,25);
  arcAroundOrigin(ctx,cx,cy,35,245,270);
  
  ctx.restore();
  spot(ctx,spotx,spoty,2);
}


/** Draw a straight line through the origin, for the history of an object travelling at speed beta. */
function movingGridCtLine(ctx,beta,cx,cy,size){
  var x1=cx+(beta*size);
  var x2=cx-(beta*size);
  line(ctx,x1,cy-size,x2,cy+size);
}

/** 
 Draw a straight line through the origin, for an x-axis corresponding to a grid 
 moving with speed beta.
*/
function movingGridXLine(ctx,beta,cx,cy,size){
  var y1=cy+(beta*size);
  var y2=cy-(beta*size);
  line(ctx,cx-size,y1,cx+size,y2);
}

/** For a moving grid. */
function addDotsToXLine(ctx,numdots/*on either side of cx,cy*/,sizedots,spacing,cx,cy,slope/*vertical? -1*/){
  for(var idx=-numdots; idx<=numdots; ++idx){
    if (idx!=0){
      if (slope!=-1){
        spot(ctx,cx+spacing*idx,cy+spacing*idx*slope,sizedots);
      }
      else {
        spot(ctx,cx,cy+spacing*idx,sizedots);
      }
    }
  }
}

/** For a moving grid. */
function addDotsToCtLine(ctx,numdots/*on either side of cx,cy*/,sizedots,spacing,cx,cy,slope/*vertical? -1*/){
  for(var idx=-numdots; idx<=numdots; ++idx){
    if (idx!=0){
      if (slope!=-1){
        spot(ctx,cx+spacing*idx*slope,cy+spacing*idx,sizedots);
      }
      else {
        spot(ctx,cx,cy+spacing*idx,sizedots);
      }
    }
  }
}

function timeOrder1(ctx){
  surfaceConstantNegativeInterval(ctx);
  spot(ctx,117,60,2);
  text(ctx,"B",124,60);
}

function timeOrder2(ctx){
  hyperbolicShellNegativeInterval(ctx);
  spot(ctx,107,60,2);
  text(ctx,"B",115,60);
}

/** Square grey area. */
function spaceTimeVolume1(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);
  ctx.fillText('Grid 1', 60, 10); 
  var cx=80;
  var cy=80;
  var size=30;
  ctx.save();
  ctx.beginPath();
  var grey="rgb(200,200,200)";
  ctx.fillStyle=grey;
  ctx.moveTo(cx-size,cy-size);
  ctx.lineTo(cx+size,cy-size);
  ctx.lineTo(cx+size,cy+size);
  ctx.lineTo(cx-size,cy+size);
  ctx.lineTo(cx-size,cy-size);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}
/** Tilted parallelogram, grey. */
function spaceTimeVolume2(ctx /*160x160*/){
  spacetime2dSmallAxesNoCone(ctx);
  ctx.fillText('Grid 2, \u03B2=-0.6', 30, 10); 
  var cx=80;
  var cy=80;
  var size=30;
  ctx.save();
  ctx.beginPath();
  var grey="rgb(200,200,200)";
  ctx.fillStyle=grey;
  var beta=-0.6;
  var boosted=lorentz(-size,size,beta);
  ctx.moveTo(cx+boosted.x,cy-boosted.ct);
  
  boosted=lorentz(size,size,beta);
  ctx.lineTo(cx+boosted.x,cy-boosted.ct);

  boosted=lorentz(size,-size,beta);
  ctx.lineTo(cx+boosted.x,cy-boosted.ct);
  
  boosted=lorentz(-size,-size,beta);
  ctx.lineTo(cx+boosted.x,cy-boosted.ct);
  
  boosted=lorentz(-size,size,beta);
  ctx.lineTo(cx+boosted.x,cy-boosted.ct);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function physicsMap(ctx /*160x160*/){
  ctx.scale(2,2);
  var black = "rgb(0,0,0)";
  var left = 15;
  var height = 20;
  //var bottom = 130;
  var bottom = 85;
  var width = 245;
  var textDelta = 15;
  //function rectUnfilled(ctx,x,y,width,height,color){

  rectUnfilled(ctx,left,bottom,width/2,height,black);
  ctx.fillText('SR', 60, bottom + textDelta); 
  
  rectUnfilled(ctx,left+width/2,bottom,width/2,height,black);
  ctx.fillText('CM', 185, bottom + textDelta); 

  rectUnfilled(ctx,left,bottom - height,width/2,height,black);
  ctx.fillText('RM', 60, bottom - height + textDelta); 

  rectUnfilled(ctx,left+width/2,bottom - height,width/4,height,black);
  ctx.fillText('QM', 155, bottom - height + textDelta);

  rectUnfilled(ctx,left+3*width/4,bottom - height,width/4,height,black);
  ctx.fillText('SP', 220, bottom - height + textDelta);
  
  rectUnfilled(ctx,left,bottom - 2*height,width/6,height,black);
  ctx.fillText('GR', 25, bottom - 2*height + textDelta); 

  rectUnfilled(ctx,left+width/6,bottom - 2*height,width/6,height,black);
  ctx.fillText('EM', 68, bottom - 2*height + textDelta); 

  rectUnfilled(ctx,left+width/3,bottom - 2*height,width/3,height,black);
  ctx.fillText('QFT', 120, bottom - 2*height + textDelta); 

  rectUnfilled(ctx,left+width/6,bottom - 3*height,width/4,height,black);
  ctx.fillText('QED', 77, bottom - 3*height + textDelta); 

  rectUnfilled(ctx,left+width/6+width/4,bottom - 3*height,width/8,height,black);
  ctx.fillText('QFD', 122, bottom - 3*height + textDelta); 
  
  rectUnfilled(ctx,left+width/6+width/4+width/8,bottom - 3*height,width/8,height,black);
  ctx.fillText('QCD', 152, bottom - 3*height + textDelta);

  rectUnfilled(ctx,left+width/6,bottom - 4*height,width/4+width/8,height,black);
  ctx.fillText('QEW', 92, bottom - 4*height + textDelta); 

  arrowUp(ctx, 5, 40);
  line(ctx, 5, 40, 5, 80);

  arrowRight(ctx, 210, bottom-height+textDelta/1.5);
  line(ctx, 190, bottom-height+textDelta/1.5, 210, bottom-height+textDelta/1.5);

  rectUnfilled(ctx,left+width/2,bottom - height,width/4,height,black);
  ctx.fillText('QM', 155, bottom - height + textDelta);

  for(idx=1; idx<30; ++idx){
    tickMarkVertical(ctx,left+width/2+2*idx,bottom,2);
  }
}

function passiveBoost(ctx){
  myFont(ctx);
  var cx=100;
  var cy=100;
  var size=85;
  var squaredInterval=1600;
  var beta=0.50;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');

  ctx.save();
  ctx.strokeStyle="rgb(255,0,0)";
  ctx.fillStyle="rgb(255,0,0)";
  movingGridCtLine(ctx,beta,cx,cy,size);
  movingGridXLine(ctx,beta,cx,cy,size);
  text(ctx,"ct'",135,10);
  text(ctx,"x'",188,60);
  
  var spotx=cx;
  var spoty=cy-50;
  var deltax = 32;
  var deltay = 64;
  dashedLine(ctx,spotx,spoty,spotx+deltax,spoty-deltax*beta);
  dashedLine(ctx,spotx,spoty,spotx-deltay*beta,spoty+deltay);
  
  greek(14, spotx+8,spoty-16, "-\u03B2\u03B3");
  greek(14, spotx-18,spoty+20, "\u03B3");
  
  ctx.restore();
  text(ctx,"Passive",80,195);
  text(ctx,"(1,0)",spotx-35,spoty);
  
  spot(ctx,spotx,spoty,2);
}

/** Show the diff between dilation and contraction. */
function activeBoost(ctx){
  myFont(ctx);
  var cx=100;
  var cy=100;
  var size=85;
  var squaredInterval=2700;
  bigMoveableAxesWithLightCone(ctx,cx,cy,size,'ct','x');
  text(ctx,"Active",80,197);
  spot(ctx,cx,cy-0.61*size,2);
  /*
  var spotx = cx-0.61*size;
  var spoty = cy-0.86*size;
  */
  var spotx = cx-0.35*size;
  var spoty = cy-0.70*size;
  text(ctx,"(1,0)",cx+5,cy-40);
  coloredLine(ctx, cx, cy, spotx, spoty, 'rgb(255,0,0)');
  
  ctx.save();
  ctx.strokeStyle="rgb(255,0,0)";
  ctx.fillStyle="rgb(255,0,0)";
  dashedLine(ctx,spotx,spoty,cx,spoty);
  dashedLine(ctx,spotx,spoty,spotx,cy);
  
  greek(14, spotx+4,spoty-8, "-\u03B2\u03B3");
  greek(14, spotx-10,spoty+40, "\u03B3");
  ctx.restore();
  
  spot(ctx,spotx, spoty,2);

  ctx.strokeStyle = 'rgb(0,0,255)';
  graphHyperbolaUp(ctx, cx, cy, -size, +size, squaredInterval);
}

function pancakeFlattens(ctx){
  myFont(ctx);
  spacetime2dSmallAxesNoCone(ctx);
  
  var width=120;
  var height=100;
  var left=20;
  var right = left + width;
  var top=20;
  var bottom = top + height;
  var bottomHistory = bottom + 20;
  var bottomPrime = top + 0.65*height;
  var spotsize = 2;
  
  rect(ctx,left,top,width,height+20,'rgb(200,200,200)');
  line(ctx,left,bottomHistory,left,top);
  line(ctx,right,bottomHistory,right,top);
  
  line(ctx,left,bottom,right,bottom);
  spot(ctx, left, bottom,spotsize);
  spot(ctx, right, bottom,spotsize);
  text(ctx,"A",left+2,bottom+10);
  text(ctx,"B",right+2,bottom+10);

  spot(ctx, right, bottomPrime,spotsize);
  line(ctx,left,bottom,right,bottomPrime);
  text(ctx,"C",right+2,bottomPrime+7);

  text(ctx,"History of a stick",(left+right)*0.20,top+12);
  text(ctx,"stationary in G",(left+right)*0.25,top+26);
}

/* Tools of general utility for HTML5 canvas graphics.*/

/**
 Set a standard font for a canvas.
 The intent is that this is called for all canvas objects.
 (Setting the canvas font can't be done in CSS.)
 If the browser has a hard minimum size of font, then it will take 
 precedence over any size specified here.
*/
function myFont(ctx){
  //12 is chosen here since it's the default min for Chrome.
  ctx.font = '12px sans-serif';
}
function myBigFont(ctx){
  ctx.font = '16px sans-serif';
}

function text(ctx,string,x,y){
  ctx.fillText(string,x,y); 
}

function textCtr(ctx,string,x,y){
  ctx.save();
  ctx.textAlign='center';
  ctx.fillText(string,x,y); 
  ctx.restore();
}

function text(ctx,string,x,y,color){
  ctx.save();
  ctx.fillStyle = color; 
  ctx.fillText(string,x,y); 
  ctx.restore();
}

/** Single line segment. */
function line(ctx, fromx, fromy, tox, toy){
  ctx.beginPath();
  ctx.moveTo(fromx,fromy);
  ctx.lineTo(tox,toy);
  ctx.stroke();
  ctx.closePath();
}

/** Single line segment, thicker than usual. */
function thickLine(ctx, fromx, fromy, tox, toy){
  ctx.save();
  ctx.lineWidth = ctx.lineWidth * 2;
  ctx.beginPath();
  ctx.moveTo(fromx,fromy);
  ctx.lineTo(tox,toy);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}


/** Arrow-head up, with the point on the given xy. */
function arrowUp(ctx, x, y){
  ctx.beginPath();
  ctx.moveTo(x-5,y+5); 
  ctx.lineTo(x,y);
  ctx.lineTo(x+5,y+5); 
  ctx.stroke();
  ctx.closePath();
}

/** Arrow-head down, with the point on the given xy. */
function arrowDown(ctx, x, y){
  ctx.beginPath();
  ctx.moveTo(x-5,y-5); 
  ctx.lineTo(x,y);
  ctx.lineTo(x+5,y-5); 
  ctx.stroke();
  ctx.closePath();
}

/** Arrow-head to the right, with the point on the given xy. */
function arrowRight(ctx, x, y){
  ctx.beginPath();
  ctx.moveTo(x-5,y-5); 
  ctx.lineTo(x,y);
  ctx.lineTo(x-5,y+5); 
  ctx.stroke();
  ctx.closePath();
}

/** Arrow-head to the left, with the point on the given xy. */
function arrowLeft(ctx, x, y){
  ctx.beginPath();
  ctx.moveTo(x+5,y-5); 
  ctx.lineTo(x,y);
  ctx.lineTo(x+5,y+5); 
  ctx.stroke();
  ctx.closePath();
}

/** Filled triangle. */
function triangle(ctx,ax,ay,bx,by,cx,cy){
  ctx.beginPath();
  ctx.moveTo(ax,ay);
  ctx.lineTo(bx,by);
  ctx.lineTo(cx,cy);
  ctx.lineTo(ax,ay);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

/** 
 Circle, filled in. Circles are less performant than rectangles.
 Firefox is currently the worst performer.
*/
function spot(ctx,x,y,r){
  ctx.beginPath();
  ctx.arc(x,y,r, 0, Math.PI*2, false);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

/** A single pixel. Smaller than a spot.*/
function point(ctx,x,y){
  ctx.beginPath();
  ctx.fillRect(x,y,1,1);
  ctx.closePath();
}

function square(ctx,x,y,size){
  ctx.beginPath();
  ctx.fillRect(x-size/2,y-size/2,size,size); //this avoids small shifts when a square morphs into a spot
  ctx.closePath();
}

/** Circle, unfilled. */
function circle(ctx,x,y,r){
  ctx.beginPath();
  ctx.arc(x,y,r, 0, Math.PI*2, false);
  ctx.stroke();
  ctx.closePath();
}

function tickMarkVertical(ctx,x,y,size){
  line(ctx,x,y-size,x,y+size);
}

function tickMarkHorizontal(ctx,x,y,size){
  line(ctx,x-size,y,x+size,y);
}

/** Filled rectangle of the given color. */
function rect(ctx,x,y,width,height,color){
  ctx.save();
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.fillRect(x,y,width,height);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/** Unfilled rectangle of the given color. */
function rectUnfilled(ctx,x,y,width,height,color){
  ctx.save();
  ctx.strokeStyle=color;
  ctx.beginPath();
  ctx.strokeRect(x,y,width,height);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}


/**
  Graph a single-valued function y=y(x). 
  Most functions are symmetrical with respect to the origin.
  Thus, you usually need to translate the 'normal' data as represented by y(x) to another origin, 
  in the center of the canvas.
  Also, since the coord system of the canvas has the positive y-axis pointing 
  downwards, there's a second transformation performed by this function, to account for that.
   fn - the function to be graphed
   ctrx, ctry - where to center the graph in the canvas
   xstart, xend - the range of x-values to be used
*/
function graphFnX(ctx, fn, ctrx, ctry, xstart, xend){
  ctx.beginPath();
  //a step of 2 pixels instead of 1 seems to suffice
  for(var x=xstart; x<=xend; x=x+2){
    var y = fn(x);
    //console.log("x:" + x + " y:" + y);
    if(x==xstart){
      ctx.moveTo(x+ctrx,ctry-y); //starting point; translation of origin, and y-axis
    }
    else {
      ctx.lineTo(x+ctrx,ctry-y); //translation of origin, and y-axis
    }
  }
  ctx.stroke();
  ctx.closePath();  
}

/**
  As in graphFnX, but the function is x=x(y). 
  Most functions are symmetrical with respect to the origin.
   fn - the function to be graphed
   ctrx, ctry - where to center the graph in the canvas
   ystart, yend - the range of y-values to be used
*/
function graphFnY(ctx, fn, ctrx, ctry, ystart, yend){
  ctx.beginPath();
  for(var y=ystart; y<=yend; y=y+2){
    var x = fn(y);
    //console.log("x:" + x + " y:" + y);
    if(y==ystart){
      ctx.moveTo(x+ctrx,ctry-y); //starting point; translation of origin, and y-axis
    }
    else {
      ctx.lineTo(x+ctrx,ctry-y); //translation of origin, and y-axis
    }
  }
  ctx.stroke();
  ctx.closePath();  
}

function graphFnXWithScale(ctx, fn, ctrx, ctry, xstart, xend, stepsize, scalex, scaley){
  ctx.beginPath();
  for(var x=xstart; x<=xend; x=x+stepsize){
    var y = fn(x);
    var xpos=ctrx+scalex*(x);
    var ypos=ctry+scaley*(-y);
    console.log("x:" + x + " y:" + y + " xstart:" + xstart + " xpos:" + xpos + " ypos:" + ypos);
    if(x==xstart){
      //console.log("Move:" + xpos);
      ctx.moveTo(xpos,ypos); //starting point; translation of origin, and y-axis
    }
    else {
      //console.log("Line xpos:" + xpos);
      ctx.lineTo(xpos,ypos); //translation of origin, and y-axis
    }
  }
  ctx.stroke();
  ctx.closePath();  
}

function graphHyperbolaUp(ctx, ctrx, ctry, xstart, xend, constant){
  var hyperbola = function(x){
   return Math.sqrt(x*x+constant);
  }
  graphFnX(ctx,hyperbola,ctrx,ctry,xstart,xend);
}

function graphHyperbolaDown(ctx, ctrx, ctry, xstart, xend, constant){
  var hyperbola = function(x){
   return (-1) * Math.sqrt(x*x+constant);   
  }
  graphFnX(ctx,hyperbola,ctrx,ctry,xstart,xend);
}

function graphHyperbolaRight(ctx,ctrx, ctry, ystart, yend, constant){
  var hyperbola = function(y){
   return Math.sqrt(y*y+constant);
  }
  graphFnY(ctx,hyperbola,ctrx,ctry,ystart,yend);
}

function graphHyperbolaLeft(ctx,ctrx, ctry, ystart, yend, constant){
  var hyperbola = function(y){
   return (-1) * Math.sqrt(y*y+constant);
  }
  graphFnY(ctx,hyperbola,ctrx,ctry,ystart,yend);
}



/**
 Project a 3D position (x1,y1,z1) onto the xz plane, using a specific point of view (x0,y0,z0).
 The point of view is typically 'behind' the xz plane, in the quadrant where y is negative, 
 and the position 1 is typically in the first quadrant, where all coords are positive.
 The caller will usually want to do 2 things with the returned value:
    * exclude items outside of some rectangular range, corresponding to their 'viewport'; the viewport 
      will typically be centered on (x0,0,z0), directly under the point-of-view.
    * translate the center of the coordinates, to be in the middle of their 'viewport'.
    
 If the (x0,y0,z0) are not passed, then the point of view is taken to be infinity, and 
 the projected coords are the same as what's passed in, and with distance as y1.
 
 Returns the 2d coordinates in the xz plane, where the line from the point-of-view to the item intersects the 
 xz plane; also return the distance from the point-of-view to the item. The caller can use the distance 
 to render a rough indication of the item's distance from the point-of-view.
*/
function projectionDrawingXZPlane(x1,y1,z1, x0,y0,z0){
  //the coords of the intersection of the line with the xz plane
  var x;
  var z;
  //the distance from the pov to the item
  var dist;
  if (arguments.length==3){
    x=x1;
    z=z1;
    dist=y1;
  }
  else {
    //find the vector from pov to the xyz 
    //no need to make this a unit vector; in addition, this form gives the distance
    var a=x1-x0;
    var b=y1-y0;
    var c=z1-z0;
    //line equations, parameterized by t; t is in range 0..1
    //x = x0 + ta;
    //y = y0 + tb;
    //z = z0 + tc;
    //find param value where y is 0
    //0 = y0 + t(y1-y0)
    var t=y0/(y0-y1); 
    //find the x,z values for the same value of the parameter t
    x=x0+t*a;
    z=z0+t*c;
    dist=Math.sqrt(a*a+b*b+c*c);
  }
  return {x:x, z:z, distance:dist};
}

/** 
 Not graphics related. Provides a way of accessing request parameter values. 
 Ref:http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript 
 Returns an object (map), with name-value pairs.
*/
function requestParams(window){
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); }, // a core js function
      query  = window.location.search.substring(1);
      
  urlParams = {};
  while (match = search.exec(query)){
     urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
}
  
/**  
 Return the mouse position relative to the canvas. 
 Used in canvas event listeners.
*/
function mousePosition(canvas,event) {
  var rect=canvas.getBoundingClientRect();
  return {
    x:event.clientX-rect.left,
    y:event.clientY-rect.top
  };
}  

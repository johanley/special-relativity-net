/**
 Change in magnitude of a star as a result of doppler factor.
 Approximates the star's spectrum as a blackbody.
 Spectral type is used for input; mapped to a representative temperature.
 
 This graph has no animation. The x-axis (D) is logarithmic in this case.
 Two spectral classes are always input, to always allow a comparison between two.
*/

//the coords assume 800*600
var XSTART = 40;
var XEND = 760;
var XWIDTH = XEND-XSTART;
var XSTEP = XWIDTH/3;
var XMIDDLE = XSTART+(XEND-XSTART)/2;

var YEND = 550;
var YSTART = 10;
var YHEIGHT = YEND-YSTART;
var NUM_VERTICAL_DIVISIONS=12;
var YSTEP = YHEIGHT/NUM_VERTICAL_DIVISIONS;
var YMIDDLE = YSTART+(YEND-YSTART)/2;

var TEXT_COLOR = "rgb(0,255,0)";
var BACKGROUND = "rgb(13,66,18)"; 
var COLOR1 = "rgb(255,255,255)";
var COLOR2 = TEXT_COLOR;

/** Input from user. */
var spectralClass1="M";
var spectralClass2="O";

/** Use the request params to change internal state. */
function applyUserInput(spClass1User,spClass2User){
  spectralClass1=spClass1User;
  spectralClass2=spClass2User;
}

/** Draw the canvas. */
function drawCanvas(ctx){
  styles(ctx);
  ctx.save();
  drawStaticParts(ctx);
  ctx.restore();
}

function styles(ctx){
  myFont(ctx);
  ctx.strokeStyle=TEXT_COLOR;
  ctx.fillStyle=TEXT_COLOR;
}

/** Contains the whole diagram. */
function drawStaticParts(ctx){
  axes(ctx);
  headsUpDisplay(ctx);
  graphs(ctx);
}

function axes(ctx){
  rect(ctx,0,0,800,600,BACKGROUND);

  text(ctx,"\u0394m",8,YMIDDLE-20);
  
  line(ctx,XSTART,YEND+5,XSTART,YSTART); // y axis, left
  line(ctx,XEND,YEND+5,XEND,YSTART); // y axis, right
  line(ctx,XSTART-5,YEND,XEND,YEND); // x axis
  
  //vertical axis - left and right
  for (var idx=0; idx<=NUM_VERTICAL_DIVISIONS; ++idx){
    var ypos=YEND-idx*YSTEP;
    var tickSize = (idx%5==0) ? 6 : 3;
    tickMarkHorizontal(ctx,XSTART,ypos,tickSize);
    tickMarkHorizontal(ctx,XEND,ypos,tickSize);
    var xpos = idx < 6 ? XSTART-15 : XSTART-19;
    var deltaMag=(-1)*idx+6;
    text(ctx,""+deltaMag,xpos,ypos+5);
    text(ctx,""+deltaMag,xpos+745,ypos+5);
    if (idx==6){
      line(ctx,XSTART,ypos,XEND,ypos); //line for 0 change in mag
    }
  }
  text(ctx,"brighter",XSTART+10,YMIDDLE-10);
  text(ctx,"dimmer",XSTART+10,YMIDDLE+20);
  
  //horizontal axis has a logarithmic scale
  text(ctx,"Doppler Factor D",XMIDDLE-40,YEND+37);
  ctx.save();
  for (var idx=0; idx<=3; ++idx){
    var xpos=XSTART+idx*XSTEP;
    var tickSize=6;
    tickMarkVertical(ctx,xpos,YEND,tickSize);
    var division=round(Math.pow(10,idx-1),1);
    text(ctx,division,xpos-10,YEND+18);
    if(idx==1){
      line(ctx,xpos,YEND,xpos,YSTART);
    }
  }
  ctx.restore();
}

/** Display some info as name-value pairs. */
function headsUpDisplay(ctx){
  var headsUpY=YSTART+30;
  var headsUpX=XSTART+20;
  var SPACING=20;
  
  ctx.save();
  ctx.fillStyle=COLOR1;
  text(ctx,"Spectral Class 1: "+spectralClass1 + ", " + spectralTypeToTemperature(spectralClass1) + "\u00B0K",headsUpX,headsUpY+SPACING*0);
  ctx.restore();
  
  ctx.save();
  ctx.fillStyle=COLOR2;
  text(ctx,"Spectral Class 2: "+spectralClass2 + ", " + spectralTypeToTemperature(spectralClass2) + "\u00B0K",headsUpX,headsUpY+SPACING*1);
  ctx.restore();
}

/** The curves for the change in apparent magnitude. */
function graphs(ctx){
  graphIt(ctx,spectralClass1,COLOR1);
  graphIt(ctx,spectralClass2,COLOR2);
}

function graphIt(ctx,specClass,color){
  ctx.save();
  ctx.strokeStyle=color;
  graphDeltaMag(ctx,XSTART,YEND,XWIDTH/3,YSTEP,specClass);
  ctx.restore();
}

function graphDeltaMag(ctx,ctrx,ctry,scalex,scaley,specClass){
  ctx.beginPath();
  var zeroMagY=YEND-6*YSTEP;
  //the x-axis is logarithmic, and holds powers of 10
  for(var i=-1; i<=2.1; i=i+0.1){
    var xval=Math.pow(10,i);
    var yval=-deltaMag(xval,specClass); //change the sign
    var xpos=ctrx+scalex*(i+1);
    var ypos=zeroMagY+scaley*(-yval);
    //console.log("xval:" + xval + " yval:" + yval + " xpos:" + xpos + " ypos:" + ypos);
    if(i==-1){
      ctx.moveTo(xpos,ypos); //starting point; translation of origin, and y-axis
    }
    else {
      ctx.lineTo(xpos,ypos); //translation of origin, and y-axis
    }
  }
  ctx.stroke();
  ctx.closePath();  
}

/** The change in magnitude for the star. Note that the mag decreases for an increase in brightness. */
function deltaMag(doppler,spClass){
  var temperature=spectralTypeToTemperature(spClass);
  return deltaMagnitude(doppler,temperature);
}
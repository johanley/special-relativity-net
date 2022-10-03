
/** Diagrams for Part II. */

/** What is a signal. Emit and detect, speed c.*/
function basicSignal(ctx/*160x160*/){
  myFont(ctx);
  line(ctx,10,160,10,60); //ct
  text(ctx,"ct",5,55);
  arrowUp(ctx,10,60);
  line(ctx,0,150,100,150); //x
  text(ctx,"x",105,152);
  arrowRight(ctx,100,150);
  
  //signal at 45 degrees from vertical
  ctx.save();
  ctx.lineWidth=2;
  ctx.strokeStyle="rgb(0,255,0)";
  line(ctx,30,120,130,20); 
  ctx.restore();
  spot(ctx,30,120,2); 
  text(ctx,"emission event",20,134);
  spot(ctx,130,20,2);
  text(ctx,"detection event",60,10);
  text(ctx,"signal at 45\u00B0",80,80);
}

/** What is a signal. Emit and detect, speed c.*/
function basicSignal2(ctx/*160x160*/){
  myFont(ctx);
  line(ctx,10,160,10,60); //ct
  text(ctx,"ct",5,55);
  arrowUp(ctx,10,60);
  line(ctx,0,150,100,150); //x
  text(ctx,"x",105,152);
  arrowRight(ctx,100,150);
  
  //signal at 45 degrees from vertical
  ctx.save();
  ctx.lineWidth=2;
  ctx.strokeStyle="rgb(0,255,0)";
  line(ctx,30,120,130,20); 
  ctx.restore();
  spot(ctx,30,120,2); 
  spot(ctx,130,20,2);
  line(ctx,130,20,160,50); 
  line(ctx,130,20,100,50); 
  line(ctx,100,50,160,50); 
  text(ctx,"signal is on the",15,10);
  text(ctx,"past light cone",15,22);
  text(ctx,"of the detector",15,34);
}

/** 3D view, detector's past light cone intersecting a history tube. */
function lightConeIntersectsHistory(ctx/*200x200*/){
  myFont(ctx);
  //axes
  var XO=10;
  var YO=180;
  var SIZE=40;
  line(ctx,XO,YO,XO,YO-SIZE); //ct
  text(ctx,"ct",XO,YO-SIZE-5);
  arrowUp(ctx,XO,YO-SIZE);
  line(ctx,XO,YO,XO+SIZE,YO); //x
  text(ctx,"x",XO+SIZE+5,YO-2);
  arrowRight(ctx,XO+SIZE,YO);
  line(ctx,XO,YO,0,YO+0.4*SIZE); //y
  text(ctx,"y",9,YO+0.4*SIZE);
  line(ctx,0,YO+0.4*SIZE,8,YO+0.25*SIZE); //y-arrows
  line(ctx,0,YO+0.4*SIZE,2,YO+0.15*SIZE); //y-arrows
  
  
  var CONEX=100;
  var CONEY=40;
  var CONESIZE=60;
  spot(ctx,CONEX,CONEY,1);
  
  //vertical history of the detector
  line(ctx,CONEX,CONEY,CONEX,CONEY-0.4*CONESIZE);
  text(ctx,"detector history",CONEX-40,10);
  text(ctx,"detector past",CONEX+10,CONEY+5);
  text(ctx,"light cone",CONEX+25,CONEY+20);
  arrowUp(ctx,CONEX,CONEY-0.4*CONESIZE);
  line(ctx,CONEX,CONEY+1.4*CONESIZE,CONEX,CONEY+1.65*CONESIZE);
  
  //sides of the light cone
  line(ctx,CONEX,CONEY,CONEX-CONESIZE,CONEY+CONESIZE);
  line(ctx,CONEX,CONEY,CONEX+CONESIZE,CONEY+CONESIZE);
  
  //half ellipse on the bottom
  ctx.save(); 
  ctx.scale(1, 0.4); 
  ctx.beginPath();
  ctx.arc(CONEX,(CONEY+CONESIZE)/0.4,60, 0, Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  //emitter
  text(ctx,"emitter history tube",CONEX-30,195);
  var EMITTERX=115;
  var EMITTERY=180;
  var ESLOPEX=6;
  var ESLOPEY=10;
  var EWIDTH1=2;
  var EWIDTH2=10;
  //below the light cone
  line(ctx,EMITTERX+EWIDTH1,EMITTERY, EMITTERX+EWIDTH1-ESLOPEX*5.7,EMITTERY-ESLOPEY*5.7);
  line(ctx,EMITTERX-EWIDTH1,EMITTERY, EMITTERX-EWIDTH1-ESLOPEX*5.8,EMITTERY-ESLOPEY*5.8);
  line(ctx,EMITTERX-EWIDTH2,EMITTERY, EMITTERX-EWIDTH2-ESLOPEX*5.9,EMITTERY-ESLOPEY*5.9);
  //above the light cone
  line(ctx,EMITTERX+EWIDTH1-ESLOPEX*8,EMITTERY-ESLOPEY*8, EMITTERX+EWIDTH1-ESLOPEX*15,EMITTERY-ESLOPEY*15);
  line(ctx,EMITTERX-EWIDTH1-ESLOPEX*7.5,EMITTERY-ESLOPEY*7.5, EMITTERX-EWIDTH1-ESLOPEX*15,EMITTERY-ESLOPEY*15);
  line(ctx,EMITTERX-EWIDTH2-ESLOPEX*8,EMITTERY-ESLOPEY*8, EMITTERX-EWIDTH2-ESLOPEX*15,EMITTERY-ESLOPEY*15);  
  //on the light cone
  line(ctx,EMITTERX-EWIDTH1-ESLOPEX*7.5,EMITTERY-ESLOPEY*7.5, EMITTERX+EWIDTH1-ESLOPEX*8,EMITTERY-ESLOPEY*8);
  line(ctx,EMITTERX-EWIDTH1-ESLOPEX*7.5,EMITTERY-ESLOPEY*7.5, EMITTERX-EWIDTH2-ESLOPEX*8,EMITTERY-ESLOPEY*8);
  
  //signals
  ctx.save();
  ctx.strokeStyle="rgb(0,255,0)";
  line(ctx,CONEX,CONEY,CONEX-37,CONEY+50);
  line(ctx,CONEX,CONEY,CONEX-31,CONEY+66);
  line(ctx,CONEX,CONEY,CONEX-32,CONEY+60);
  ctx.restore();
}

/** Curves showing D as a function of angle, for various values of beta.*/
function dopplerGraphForVariousBeta(ctx /*400x200*/){
  myFont(ctx);
  var xstart = 20;
  var xend = 360;
  var xwidth = xend-xstart;
  var middle = xstart+(xend-xstart)/2;
  var yend = 170;
  var ystart = 0;
  var yheight = yend-ystart;
  var ystep = yheight/3;
  //red area
  ctx.save();
  ctx.fillStyle="rgb(242,153,153)";
  ctx.fillRect(xstart,yend-ystep,xend-xstart,ystep);
  ctx.stroke();
  ctx.restore();
  //blue area
  ctx.save();
  ctx.fillStyle="rgb(166,233,255)";
  ctx.fillRect(xstart,ystart,xend-xstart,yend-ystep);
  ctx.stroke();
  ctx.restore();
  text(ctx,"0\u00B0",xstart-3,yend+15);
  text(ctx,"Approaching",xstart+30,yend+25);
  text(ctx,"180\u00B0",xend-10,yend+15);
  text(ctx,"Receding",xend-96,yend+25);
  text(ctx,"90\u00B0",middle-10,yend+15);
  text(ctx,"Transverse",middle-33,yend+25);
  text(ctx,"D",0,90);
  text(ctx,"Blueshift",300,110);
  text(ctx,"Redshift",25,125);
  text(ctx,"\u03B8",xend+15,yend+5);
  line(ctx,xstart,yend+5,xstart,0); //D axis
  line(ctx,xstart-5,yend,xend,yend); //theta axis
  tickMarkVertical(ctx,middle,yend,3);
  line(ctx,middle,yend,middle,ystart);
  tickMarkVertical(ctx,xend,yend,3);
  for (var idx=1; idx<=3; ++idx){
    var ypos=yend-idx*ystep;
    text(ctx,idx,xstart-12,ypos+9);
    tickMarkHorizontal(ctx,xstart,ypos,3);
    if (idx==1){
      line(ctx,xstart,ypos,xend,ypos); //line for D=1
    }
  }
  var STEP_SIZE=Math.PI/60;
  graphFnXWithScale(ctx,dopplerA,xstart,yend,0,Math.PI,STEP_SIZE,xwidth/Math.PI,yheight/3);
  graphFnXWithScale(ctx,dopplerB,xstart,yend,0,Math.PI,STEP_SIZE,xwidth/Math.PI,yheight/3);
  graphFnXWithScale(ctx,dopplerC,xstart,yend,0,Math.PI,STEP_SIZE,xwidth/Math.PI,yheight/3);
  text(ctx,"\u03B2 0.25",xend,yend-40);
  text(ctx,"\u03B2 0.60",xend,yend-25);
  text(ctx,"\u03B2 0.87",xend,yend-10);
}
function dopplerA(theta){
  return doppler(0.25,theta);
}
function dopplerB(theta){
  return doppler(0.6,theta);
}
function dopplerC(theta){
  return doppler(0.87,theta);
}

/** Show the energy and direction of a photon in a simple 2d diagram. */
function photon2d(ctx /*200x200*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.lineWidth=1;
  //both t,x axes
  ctx.fillText('x', 192, 100); //axis labels
  ctx.fillText('direction',120,110); 
  ctx.fillText('energy', 80, 4);
  ctx.fillText('light',160,50); 
  ctx.fillText('cone',160,60); 
  ctx.fillText('Different energies,',45,170); 
  ctx.fillText('different directions',45,185); 

  line(ctx,10,100,190,100);
  line(ctx,100,10,100,190);
  arrowUp(ctx,100,10);
  arrowRight(ctx,190,100);
  ctx.lineWidth=2;
  //the light cone
  //ctx.lineWidth = 23;
  line(ctx,20,180,180,20);
  line(ctx,20,20,180,180);
  //green photon vector
  ctx.strokeStyle="rgb(0,255,0)";
  line(ctx,100,100,140,60);
  line(ctx,140,60,137,70);
  line(ctx,140,60,132,63);
  //blue photon vector
  ctx.strokeStyle="rgb(100,100,255)";
  line(ctx,100,100,40,40);
  line(ctx,40,40,43,51);
  line(ctx,40,40,50,42);
}
/** Show the energy and direction of a photon. */
function photonVector(ctx/*200x200*/){
  myFont(ctx);
  ctx.textBaseline = 'middle';
  ctx.fillText('light cone',130,85); 
  ctx.fillText('Same energy,',60,150); 
  ctx.fillText('different directions',60,165); 
  ctx.fillText('energy',80,4); 
  ctx.fillText('y',20,137); 
  ctx.fillText('x',177,137); 
  
  //t,x, and y axes
  line(ctx,113,112,30,135);
  line(ctx,88,112,170,135);
  line(ctx,100,13,100,73);
  arrowUp(ctx,100,13);
  line(ctx,163,128,170,135);
  line(ctx,163,138,170,135);
  line(ctx,35,127,30,135);
  line(ctx,37,139,30,135);
  
  //light cone
  ctx.lineWidth = 2;
  line(ctx,100,115,140,60);
  line(ctx,100,115,60,60);
  //ellipse on the top - a distorted circle
  ctx.save(); //stack - save the current ctx for later use
  ctx.scale(1, 0.4); //stretch the coords - the size and direction of the eccentricity; here 'y' is smaller than 'x'
  ctx.beginPath();
  ctx.arc(100,142,40, 0, Math.PI*2, false);
  ctx.stroke();
  ctx.closePath();
  ctx.restore(); //go back to the previous set of context properties
  //photon vectors touching the ellipse
  ctx.save();
  ctx.strokeStyle="rgb(0,255,0)";
  line(ctx,100,115,100,72);
  arrowUp(ctx,100,72);
  
  line(ctx,100,115,120,71);
  line(ctx,120,71,124,75);
  line(ctx,120,71,113,75);
  
  line(ctx,100,115,80,43);
  line(ctx,80,43,76,49);
  line(ctx,80,43,87,47);
  
  ctx.restore();
}

/** Ellipse showing the doppler effect and aberration. */
function dopplerEllipse(ctx/*300x200*/){
  //reuse the animation, since there's a lot of associated code
  ctx.save();
  //the colors are too faint, without a dark background
  //var BACKGROUND = "rgb(13,66,18)"; 
  var BACKGROUND = "rgb(50,50,50)"; 
  ctx.fillStyle=BACKGROUND;
  ctx.fillRect(0,0,400,200);
  ctx.restore();
  //we need to rescale, to match the smaller canvas used here
  ctx.translate(-200,-50);
  drawLorentzTransformEllipse(ctx);
}

/** Showing the effect is from travel-time and time dilation. */
function dopplerEffect(ctx/*200x200*/,beta){
  myFont(ctx);
  var CTRX=100;
  var CTRY=100;
  var SIZE = 90;
  var WRISTWATCH_TICK = 20; 
  var NUM_DETECTOR_TICKS=4; 
  //var FONT = 'bold 16px sans-serif';
  var SPOT_COLOR = "rgb(0,0,0)";
  var TICK_COLOR = "rgb(0,0,0)";
  //axes in the lower left
  //two stationary detectors
  line(ctx,CTRX-SIZE,CTRY-SIZE,CTRX-SIZE,CTRY+SIZE);
  line(ctx,CTRX+SIZE,CTRY-SIZE,CTRX+SIZE,CTRY+SIZE);
  var tweak=10;
  text(ctx,"D1",CTRX-SIZE-tweak,CTRY+SIZE+tweak);
  text(ctx,"D2",CTRX+SIZE-tweak,CTRY+SIZE+tweak);
  ctx.save();
  ctx.fillStyle=SPOT_COLOR;
  for(var idx=0; idx<=NUM_DETECTOR_TICKS; ++idx){
    var dist=idx*WRISTWATCH_TICK;
    spot(ctx,CTRX-SIZE,CTRY+dist,1); //left
    spot(ctx,CTRX-SIZE,CTRY-dist,1);
    spot(ctx,CTRX+SIZE,CTRY+dist,1); //right
    spot(ctx,CTRX+SIZE,CTRY-dist,1);
  }
  ctx.restore();
  
  //a moving source
  //var beta=0;//0.5;
  text(ctx,"\u03B2="+beta,135,175);
  var deltax=beta*SIZE;
  var deltat=SIZE;
  line(ctx,CTRX-deltax,CTRY+deltat,CTRX+deltax,CTRY-deltat); //start lower left
  text(ctx,"Source",CTRX-deltax-5,CTRY+deltat+10);
  
  //c-signals from the source
  //find the events that correspond to N ticks of wristwatch time
  var gammaVal=gamma(beta);
  ctx.save();
  ctx.fillStyle=SPOT_COLOR;
  for(var idx=0;idx<=NUM_DETECTOR_TICKS;++idx){
    var deltat=gammaVal*idx*WRISTWATCH_TICK; //time dilation
    var deltax=beta*deltat;
    if (deltax<SIZE && deltat<SIZE){
      spot(ctx,CTRX+deltax,CTRY-deltat,1);
      spot(ctx,CTRX-deltax,CTRY+deltat,1);
      lightCones(ctx,deltax,deltat,CTRX,CTRY,SIZE);
    }
  }
  ctx.restore();
}

function lightCones(ctx,deltax,deltat,CTRX,CTRY,SIZE){
  ctx.save();
  ctx.strokeStyle="rgb(0,255,0)";
  //towards the left detector
  var deltaleft=SIZE-deltax;
  line(ctx,CTRX-deltax,CTRY+deltat, CTRX-SIZE,CTRY+deltat-deltaleft); 

  //towards the right detector
  var deltaright=SIZE+deltax;
  line(ctx,CTRX-deltax,CTRY+deltat, CTRX+SIZE,CTRY+deltat-deltaright); 
  ctx.restore();
}

function aberrationTheta1(ctx/*200x200*/){
  var CTRX=100;
  var CTRY=100;
  aberrationTheta(ctx/*200x200*/);
  aberrationAngles1(ctx,CTRX,CTRY);
}

function aberrationTheta2(ctx/*200x200*/){
  var CTRX=100;
  var CTRY=100;
  aberrationTheta(ctx/*200x200*/);
  aberrationAngles2(ctx,CTRX,CTRY);
}

/** Show the exact meaning of theta in the aberration formula. */
function aberrationTheta(ctx/*200x200*/){
  myFont(ctx);
  var CTRX=100;
  var CTRY=100;
  var SIZE=80;
  ctx.save();
  ctx.lineWidth=2;
  //x axis to the right
  line(ctx,CTRX,CTRY,CTRX+SIZE,CTRY);
  arrowRight(ctx,CTRX+SIZE,CTRY);
  //text(ctx,"x,x'",CTRX+SIZE+1,CTRY+3);
  //photon vector, as seen in two grids, from the origin towards the direction of motion
  line(ctx,CTRX,CTRY,CTRX+SIZE*Math.cos(2),CTRY+Math.sin(2)*SIZE);
  line(ctx,CTRX,CTRY,CTRX+SIZE*Math.cos(2.3),CTRY+Math.sin(2.3)*SIZE);
  //arrowheads on the end of the photon vectors, away from the source
  line(ctx,CTRX+SIZE*Math.cos(2.3),CTRY+Math.sin(2.3)*SIZE,CTRX+SIZE*Math.cos(2.3),CTRY+Math.sin(2.3)*SIZE-10);
  line(ctx,CTRX+SIZE*Math.cos(2.3),CTRY+Math.sin(2.3)*SIZE,CTRX+SIZE*Math.cos(2.3)+8,CTRY+Math.sin(2.3)*SIZE-1);
  line(ctx,CTRX+SIZE*Math.cos(2),CTRY+Math.sin(2)*SIZE,CTRX+SIZE*Math.cos(2)-2,CTRY+Math.sin(2)*SIZE-10);
  line(ctx,CTRX+SIZE*Math.cos(2),CTRY+Math.sin(2)*SIZE,CTRX+SIZE*Math.cos(2)+7,CTRY+Math.sin(2)*SIZE-2);
  ctx.restore();
  //smaller lines back to the emitting source
  line(ctx,CTRX,CTRY,CTRX-SIZE*Math.cos(2),CTRY-Math.sin(2)*SIZE);
  line(ctx,CTRX,CTRY,CTRX-SIZE*Math.cos(2.3),CTRY-Math.sin(2.3)*SIZE);

  text(ctx,"boost direction",CTRX-7,CTRY+60);
  line(ctx,CTRX-10,CTRY+65,CTRX+95,CTRY+65);
  arrowRight(ctx,CTRX+95,CTRY+65);

  text(ctx,"P",63,185);
  text(ctx,"P'",37,173);
  text(ctx,"D",130,25);
  text(ctx,"D'",155,40);
}

function aberrationAngles1(ctx/*200x200*/,CTRX,CTRY){
  text(ctx,"\u03B8",CTRX+10,CTRY+20);
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,15,0,2,false);
  ctx.stroke();
  ctx.closePath();
  text(ctx,"\u03B8'",CTRX+16,CTRY+35);
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,30,0,2.3,false);
  ctx.stroke();
  ctx.closePath();
}
function aberrationAngles2(ctx/*200x200*/,CTRX,CTRY){
  text(ctx,"\u03B8",CTRX+27,CTRY-15);
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,15,0,5.5,true);
  ctx.stroke();
  ctx.closePath();
  text(ctx,"\u03B8'",CTRX+14,CTRY-5);
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,30,0,5.15,true);
  ctx.stroke();
  ctx.closePath();
}

/** Display the meaning of beta and theta appearing in the formula for the doppler factor. */
function dopplerGeometry(ctx/*200x200*/){
  myFont(ctx);
  var CTRX=150;
  var CTRY=50;
  spot(ctx,CTRX,CTRY,2);
  text(ctx,"line-of-sight",66,44);
  line(ctx,CTRX,CTRY,57,CTRY);
  arrowLeft(ctx,57,CTRY);
  text(ctx,"Detector",1,CTRY+3);
  
  text(ctx,"line-of-motion",49,115);
  text(ctx,"\u03B2",144,115);
  line(ctx,CTRX,CTRY,130,160);
  line(ctx,130,160,136,154);
  line(ctx,130,160,126,153);
  text(ctx,"Source",113,160+10);
  
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,20,1.8,Math.PI,false);
  ctx.stroke();
  ctx.closePath();
  text(ctx,"\u03B8",CTRX-24,CTRY+22);
}

/** Scissors effect.*/
function scissors1(ctx/*220x160*/){
  scissors(ctx,35,0.6,75);
}
/** Scissors effect.*/
function scissors2(ctx/*220x160*/){
  scissors(ctx,17,0.9,100);
}
/** Scissors effect.*/
function scissors(ctx/*220x160*/,startx,speed,size){
  myFont(ctx);
  //axes
  line(ctx,10,160,10,60); //ct
  text(ctx,"ct",5,55);
  arrowUp(ctx,10,60);
  line(ctx,0,150,100,150); //x
  text(ctx,"x",105,152);
  arrowRight(ctx,100,150);
  
  //the light cone
  var coneheadx=130;
  var coneheady=20;
  var conesize=80;
  line(ctx,coneheadx,coneheady,coneheadx+conesize,coneheady+conesize); 
  line(ctx,coneheadx,coneheady,coneheadx-conesize,coneheady+conesize); 
  //the detector's history
  line(ctx,coneheadx,coneheady-20,coneheadx,coneheady+1.55*conesize); 
  text(ctx,"detector",coneheadx+5,coneheady+1.45*conesize);
  text(ctx,"detector",155,35);
  text(ctx,"light cone",160,45);
  
  //the history at a given speed
  var starty=140;
  line(ctx,startx,starty,startx+size,starty-size/speed);
  text(ctx,"emitter",startx+10,135);
  text(ctx,"\u03B2="+speed,50,40);
  //the signal 
  spot(ctx,coneheadx-0.7*conesize,coneheady+0.7*conesize,2);
  spot(ctx,coneheadx,coneheady,2);
  ctx.save();
  ctx.lineWidth=1;
  ctx.strokeStyle="rgb(0,255,0)";
  line(ctx,coneheadx,coneheady,coneheadx-0.7*conesize,coneheady+0.7*conesize); 
  ctx.restore();
}

/** Display the meaning of beta and theta. */
function radialAndTransverse(ctx/*200x200*/){
  myFont(ctx);
  var CTRX=150;
  var CTRY=50;
  spot(ctx,CTRX,CTRY,2);
  line(ctx,CTRX,CTRY,55,CTRY);
  arrowLeft(ctx,55,CTRY);
  text(ctx,"detector",1,CTRY+3);
  
  text(ctx,"\u03B2",115,123);
  line(ctx,CTRX,CTRY,120,110);
  line(ctx,120,110,119,103);
  line(ctx,120,110,127,105);
  text(ctx,"line of motion",42,90);
  
  ctx.beginPath();
  ctx.arc(CTRX,CTRY,25,2.05,Math.PI,false);
  ctx.stroke();
  ctx.closePath();
  text(ctx,"\u03B8",CTRX-28,CTRY+26);
  
  //bt and br 
  ctx.save();
  ctx.lineWidth=2;
  line(ctx,CTRX,CTRY,CTRX-40,CTRY);
  line(ctx,CTRX,CTRY,CTRX,CTRY+110);
  arrowLeft(ctx,CTRX-40,CTRY);
  arrowDown(ctx,CTRX,CTRY+110);
  text(ctx,"br",CTRX-20,CTRY-5);
  text(ctx,"bt",CTRX+5,CTRY+60);
  ctx.restore();
}

/** Stats from the starfield simulation. */
function totalNumStarsMag5Tycho(ctx){
  var data=new Array();
  addDataPoint(data,0.0,1533);
  addDataPoint(data,0.1,1628);
  addDataPoint(data,0.2,1808);
  addDataPoint(data,0.3,2161);
  addDataPoint(data,0.4,2827);
  addDataPoint(data,0.5,3953);
  addDataPoint(data,0.6,5862);
  addDataPoint(data,0.7,8976);
  addDataPoint(data,0.8,14566);
  addDataPoint(data,0.85,19174);
  addDataPoint(data,0.9,25874);
  addDataPoint(data,0.94,33947);
  addDataPoint(data,0.96,39443);
  addDataPoint(data,0.97,42781);
  addDataPoint(data,0.98,46572);
  addDataPoint(data,0.99,50132);
  addDataPoint(data,0.993,50737);
  addDataPoint(data,0.999,43100);
  addDataPoint(data,0.9999,25162);
  addDataPoint(data,0.99999,11519);
  addDataPoint(data,0.999999,4411);
  addDataPoint(data,0.9999999,1455);
  starfieldStats(ctx,data,60000);
  text(ctx,"Total number of stars <= mag 5",75,30);
  text(ctx,"Peak: 50,737 at \u03B2=0.993",100,50);
}

/** Stats from the starfield simulation. */
function totalBrightnessMag5Tycho(ctx){
  var data=new Array();
  addDataPoint(data,0.0,38.84);
  addDataPoint(data,0.1,41.19);
  addDataPoint(data,0.2,47.94);
  addDataPoint(data,0.3,61.39);
  addDataPoint(data,0.4,85.86);
  addDataPoint(data,0.5,128.40);
  addDataPoint(data,0.6,203.40);
  addDataPoint(data,0.7,338.49);
  addDataPoint(data,0.75,446.86);
  addDataPoint(data,0.8,601.41);
  addDataPoint(data,0.85, 830.74);
  addDataPoint(data,0.9,1188.05);
  addDataPoint(data,0.91,1283.35);
  addDataPoint(data,0.92,1390.69);
  addDataPoint(data,0.93,1509.14);
  addDataPoint(data,0.94,1643.50);
  addDataPoint(data,0.95,1795.11);
  addDataPoint(data,0.96,1967.55);
  addDataPoint(data,0.97,2163.76);
  addDataPoint(data,0.98,2381.58);
  addDataPoint(data,0.993,2605.21);
  addDataPoint(data,0.995,2583.86);
  addDataPoint(data,0.999,2118.78);
  addDataPoint(data,0.9999,1165.48);
  addDataPoint(data,0.99999,495.48);
  addDataPoint(data,0.999999,175.60);
  addDataPoint(data,0.9999999,54.58);
  starfieldStats(ctx,data,2800);
  text(ctx,"Total brightness of all stars <= mag 5",60,30);
  text(ctx,"Peak: 2605 at \u03B2=0.993",100,50);
}


/** Graph numeric results from the starfield animation. */
function starfieldStats(ctx/*300x300*/,data,ymax){
  myFont(ctx);
  var originx=40;
  var originy=280;
  var size=250;
  var tickSize=size/10;
  
  //speed axis 0..1
  line(ctx,originx,originy,originx+size,originy);
  text(ctx,"\u03B2",230,originy+18);
  for(var idx=0; idx<=10; ++idx){
    tickMarkVertical(ctx,originx+idx*tickSize,originy,2);
    if (idx%5==0){
      text(ctx,""+idx/10,originx+idx*tickSize-7,originy+15);
    }
  }
  //vertical axis
  var ymultiplier=ymax/10;
  line(ctx,originx,originy,originx,originy-size);
  for(var idx=0; idx<=10; ++idx){
    tickMarkHorizontal(ctx,originx,originy-idx*tickSize,2);
    text(ctx,""+idx*ymultiplier,originx-41,originy-idx*tickSize+5);
  }
  //data points as dots
  var fullWidth=10*tickSize;
  for(var idx=0; idx<data.length; ++idx){
    var xpos=originx+(fullWidth*data[idx].x);
    var ypos=originy-(fullWidth*data[idx].y/ymax);
    spot(ctx,xpos,ypos,2);
  }
  //join the dots; begin at the first data point
  ctx.beginPath();
  ctx.moveTo(  originx+(fullWidth*data[0].x)  ,  originy-(fullWidth*data[0].y/ymax) );
  for(var idx=1; idx<data.length; ++idx){
    var xpos=originx+(fullWidth*data[idx].x);
    var ypos=originy-(fullWidth*data[idx].y/ymax);
    ctx.lineTo(xpos,ypos);
  }
  ctx.stroke();
  ctx.closePath();
}

/** Add the data point on to the end of the given array. */
function addDataPoint(data,xval,yval){
  var point={x:xval,y:yval};
  return data.push(point);
}

/** Graphs of the aberration formula. */
function aberrationGraphDetectorDir(ctx/*300x300*/){
  var originx=40;
  var originy=280;
  aberrationGraph(ctx, aberrationFormulaDetectorDirection, originx, originy);
  text(ctx,"\u03B2=0.0",originx+95,originy-140);
  text(ctx,"\u03B2=0.5",originx+135,originy-80);
  text(ctx,"\u03B2=0.9",originx+165,originy-45);
}
function aberrationGraphPhotonDir(ctx/*300x300*/){
  var originx=40;
  var originy=280;
  aberrationGraph(ctx, aberrationFormulaPhotonDirection, originx, originy);
  text(ctx,"\u03B2=0.0",originx+160,originy-140);
  text(ctx,"\u03B2=0.5",originx+75,originy-160);
  text(ctx,"\u03B2=0.9",originx+35,originy-190);
}
function aberrationGraph(ctx/*300x300*/, formula, originx, originy){
  var size=250;
  var scale = size / Math.PI;
  myFont(ctx);
  aberrationGraphAxes(ctx, originx, originy, size);
  aberrationThetaGraphPoints(0.5, originx, originy, size, formula);
  aberrationThetaGraphPoints(0.9, originx, originy, size, formula);
}
function aberrationThetaGraphPoints(beta, originx, originy, size, formula){
  var data=new Array();
  var num_divisions = 18;
  var increment = Math.PI/num_divisions;
  for(var idx = 0; idx <= num_divisions; ++idx){
    var theta = idx*increment;
    var thetaPrime = formula(theta, beta);
    addDataPoint(data,theta,thetaPrime);
  }
  aberrationGraphDataPoints(ctx, data, size, originx, originy);
}
/** Returns 0..pi */
function aberrationFormulaDetectorDirection(theta, beta){
  var numerator = Math.cos(theta) + beta;
  var denominator = 1 + beta * (Math.cos(theta));
  return Math.acos(numerator / denominator); //0..pi
}
/** Returns 0..pi */
function aberrationFormulaPhotonDirection(theta, beta){
  var numerator = Math.cos(theta) - beta;
  var denominator = 1 - beta * (Math.cos(theta));
  return Math.acos(numerator / denominator); //0..pi
}
function aberrationGraphAxes(ctx/*300x300*/, originx, originy, size){
  var tickSize=size/18;
  //x axis 0..pi
  line(ctx,originx,originy,originx+size,originy);
  for(var idx=0; idx<=18; ++idx){
    tickMarkVertical(ctx,originx+idx*tickSize,originy,2);
  }
  greek(18, 160, originy+18, "\u03B8");
  text(ctx,"0",originx-3,originy+18);
  greek(18,originx+size-3,originy+18, "\u03C0");
  
  //y axis 0..pi
  line(ctx,originx,originy,originx,originy-size);
  for(var idx=0; idx<=18; ++idx){
    tickMarkHorizontal(ctx,originx,originy-idx*tickSize,2);
  }
  greek(18, originx-18,originy-size/2+10, "\u03B8'");
  text(ctx,"0",originx-14,originy+5);
  //text(ctx,"\u03C0",originx-14,originy-size+3);
  greek(18, originx-14,originy-size+3,"\u03C0");
  
  //line for no deviation at all
  dashedLine(ctx,originx,originy,originx+size,originy-size);
}
function aberrationGraphDataPoints(ctx, data, size, originx, originy){
  //data points as dots
  var scale = size / Math.PI;
  for(var idx=0; idx<data.length; ++idx){
    var xpos=originx+(scale*data[idx].x);
    var ypos=originy-(scale*data[idx].y);
    spot(ctx,xpos,ypos,1);
  }
  //join the dots; begin at the first data point
  ctx.beginPath();
  ctx.moveTo(originx+(scale*data[0].x) , originy-(scale*data[0].y));
  for(var idx=1; idx<data.length; ++idx){
    var xpos=originx+(scale*data[idx].x);
    var ypos=originy-(scale*data[idx].y);
    ctx.lineTo(xpos,ypos);
  }
  ctx.stroke();
  ctx.closePath();
}
function greek(size, x, y, letters){
  ctx.save();
  ctx.font = size + "px Times New Roman";
  ctx.fillText(letters, x, y); 
  ctx.restore();
}

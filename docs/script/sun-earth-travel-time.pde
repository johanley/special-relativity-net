/*
 Simulate a photon travelling from the sun to the earth.
 
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

int numseconds;

void setup(){
  size(541, 100);
  frameRate(1);
  numseconds = 0;
}

void draw(){
  background(100);
  //sun and earth in white
  stroke(255); 
  ellipse(20, 50, 2, 2); //sun
  point(521, 50, 1); //earth    
  text("Sun", 7, 80);
  text("Earth", 500, 80);
  text(numseconds + "s", 100, 80);

  //the photon in yellow, at 1 pixel per frame
  stroke(255,255,0);
  line(24, 50, 24 + numseconds, 50);
  numseconds = numseconds + 1;
  //start over with a new photon after it reaches the end
  if (numseconds > 497) {
    numseconds = 0;
  }
}



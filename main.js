var canvas = $('canvas');
var ctx = canvas.getContext('2d');
var minLength = Math.min(innerHeight, innerWidth)/2;
var clock = new Clock(minLength*0.8, 12, innerWidth/2, innerHeight/2);

var lastNumberInput = $('.lastNumber');
lastNumberInput.addEventListener('keyup', function(event) {
  clock.setLastNumber(parseInt(lastNumberInput.value));
  clock.update();
})

var mouse = {x: undefined, y: undefined}
var mouseTheta = undefined;
var mouseDownTheta = undefined;
var thetaOffsetOld = 0;
window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;

  // if mousedown on canvas
  if (mouseDownTheta!==undefined) {
    mouseTheta = getMouseAngle(mouse.x,mouse.y);
    thetaOffset = thetaOffsetOld + mouseTheta - mouseDownTheta;
    clock.setThetaOffset(thetaOffset);
    clock.update();
  }
})

canvas.addEventListener('mousedown', function(event) {
  mouseDownTheta = getMouseAngle(mouse.x,mouse.y);
})

canvas.addEventListener('mouseup', function(event) {
  mouseDownTheta = undefined;
  thetaOffsetOld = thetaOffset;
})

init();
animate();


//////////////////////////////////

function $(x) {return document.querySelector(x);}

function getMouseAngle(mx,my) {
  mx = mx - innerWidth/2;
  my = my - innerHeight/2;
  mr = Math.sqrt(mx*mx + my*my);
  mtheta = Math.acos(my/mr);
  if (mx>0) mtheta = Math.PI*2 - mtheta;
  return mtheta;
}

function Clock(radius, lastNumber, centerX, centerY) {
  this.radius = radius;
  this.lastNumber = lastNumber;
  this.centerX = centerX;
  this.centerY = centerY;
  this.thetaOffset = 0;

  this.draw = function() {
    for (var n=1; n<=this.lastNumber; n++) {
      theta = n * Math.PI * 2 / this.lastNumber;
      x = this.centerX + this.radius * Math.sin(theta + this.thetaOffset);
      y = this.centerY - this.radius * Math.cos(theta + this.thetaOffset);
      writeNumber(n,x,y);
    }
  }

  this.update = function() {
    this.draw();
  }

  this.setLastNumber = function(lastNumber) {
    this.lastNumber = lastNumber;
  }

  this.setThetaOffset = function(thetaOffset) {
    this.thetaOffset = thetaOffset;
  }

  function writeNumber(n, x, y) {
    ctx.font = '36px Source Sans Pro';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333';
    ctx.fillText(n, x, y);
  }
}

function drawClockLines(radiusIn, radiusOut, centerX, centerY) {
  totalLines = 12;
  for (var i=1; i<=totalLines; i++) {
    theta = i * Math.PI * 2 / totalLines;
    xStart = centerX + radiusIn * Math.sin(theta);
    yStart = centerY + radiusIn * Math.cos(theta);
    xEnd = centerX + radiusOut * Math.sin(theta);
    yEnd = centerY + radiusOut * Math.cos(theta);
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#aaa';
    ctx.stroke();
  }
}

function init() {
  canvas.width = window.innerWidth*window.devicePixelRatio;
  canvas.height = window.innerHeight*window.devicePixelRatio;
  canvas.style.width = canvas.width/window.devicePixelRatio+'px';
  canvas.style.height = canvas.height/window.devicePixelRatio+'px';
  ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  drawClockLines(minLength*0.5, minLength*0.6, innerWidth/2, innerHeight/2);
  clock.update();
}
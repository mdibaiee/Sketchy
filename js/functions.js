"use strict";
/*** ESSENTIALS ***/

function sizeAndPos() {

  var data = c.getImageData(0,0, $c.width(), $c.height());
  var w = $(window).width(),
      h = $(window).height();
  $c.css({'margin-left': w * .05,
    'margin-top': h * .05
  })
  $c.attr('width', w * .9);
  $c.attr('height',h * .9 - 50);
  c.clearRect(0,0, $c.width(), $c.height());
  c.putImageData(data, 0, 0);
}

function relative(x,y) {
  return {
    x : x - $c.offset().left,
    y : y - $c.offset().top
  }
}

function threshold(x1, y1, x2, y2, threshold) {
  var tr = threshold || 5;
  if( x1 <= x2 + tr && x1 >= x2 - tr && y1 <= y2 + tr && y1 >= y2 - tr ) return true; 
  return false;
}

function line(x1, y1, x2, y2, opts) {
  opts = opts || {};
  c.beginPath();
  c.lineCap = opts.lineCap || settings.lineCap;
  c.lineJoin = opts.lineJoin || settings.lineJoin;
  c.strokeStyle = opts.strokeStyle || settings.strokeStyle;
  c.lineWidth = opts.lineWidth || settings.lineWidth;
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}


/*** END ***/

function startPoint(x, y) {

  // If not previous point exists, make the first one.
  if( !points.length ) points.push({x: x, y: y, type: settings.type, start: {x: x, y: y}});

  var old = points[points.length-1],
      start = old.start,
      current = {
        x : x,
        y : y,
        start : old.start || {x: x, y: y},
        type : settings.type
      }
  // Just draws a circle
  line(x,y,x,y);

  if( old.type == 'line' ) {
    line(old.x, old.y, x, y);
  }

  if( points.length > 1 && ((start && threshold(start.x, start.y, x, y)) || threshold(old.x, old.y, x, y, 2)) ) {
    window.active = false;
    points[points.length-1].type = '';
    points[points.length-1].start = undefined;
    return;
  }

  points.push(current);
}

function drawPoint(x,y) {
  var capture = points[points.length-1];

  switch(capture.type) {
    case 'draw': {
      line(capture.x, capture.y, x, y);

      var current = {
        x : x,
        y : y,
        start : capture.start,
        type : capture.type
      }

      points.push(current);
      break;
    }
    case 'sketch': {
      line(capture.x, capture.y, x, y);
      var current = {
        x : x,
        y : y,
        start : capture.start,
        type : capture.type
      }
      points.push(current);

      for( var i = 0, len = points.length-1; i < len; i++ ) {
        if( threshold(points[i].x, points[i].y, current.x, current.y, 40)) {
          var x = points[i].x - current.x,
              y = points[i].y - current.y;

          line(points[i].x - x*0.2, points[i].y - y*0.2, current.x + x*0.2, current.y + y*0.2, {strokeStyle: 'rgba(0,0,0,0.4)', lineWidth: settings.lineWidth/2})
        }
      }
      break; 
    }
  }
}



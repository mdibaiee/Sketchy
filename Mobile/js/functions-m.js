"use strict";
/*** ESSENTIALS ***/

function sizeAndPos() {

  var data = c.getImageData(0,0, $c.width(), $c.height());
  var w = $(window).width(),
      h = $(window).height() - 53;
  $c.attr('width', w * window.devicePixelRatio);
  $c.attr('height',h * window.devicePixelRatio);
  $c.css({
    'width' : w,
    'height' : h
  });
  c.clearRect(0,0, width(), height());
  c.putImageData(data, 0, 0);
}

function relative(x,y, el) {
  var el = el || $c[0];
  return {
    x : x*window.devicePixelRatio - el.offset().left,
    y : (y - 53) * window.devicePixelRatio - el.offset().top
  }
}

function threshold(x1, y1, x2, y2, threshold) {
  var tr = threshold || 5;
  if( x1 <= x2 + tr && x1 >= x2 - tr && y1 <= y2 + tr && y1 >= y2 - tr ) return true; 
  return false;
}

function draw(x1, y1, x2, y2, opts, overlay) {
  opts = opts || {};
  var c = window.c;
  if( overlay ) var c = window.o;
  c.beginPath();
  if( settings.type == 'eraser' ) c.globalCompositeOperation = 'destination-out';
  else c.globalCompositeOperation = opts.composite || settings.composite;
  c.lineCap = opts.lineCap || settings.lineCap;
  c.lineJoin = opts.lineJoin || settings.lineJoin;
  c.strokeStyle = opts.color || settings.color;
  c.fillStyle = opts.color || settings.color;
  c.lineWidth = ( opts.lineWidth || settings.lineWidth ) / 10;
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  if( !opts.noStroke ) c.stroke();
  if( opts.fill ) c.fill();
}

function shape(opts, overlay) {
  if(overlay) var c = window.o;
  else var c = window.c;
  c.beginPath();
  c.fillStyle = opts.color || settings.color;
  switch(opts.type) {
  
    case 'circle': {
      c.arc(opts.x, opts.y, opts.radius, 0, 2*Math.PI);
      break;
    }
    case 'rectangle': {
      c.rect(opts.x, opts.y, opts.width, opts.height);
      break;
    }
    case 'square': {
      c.rect(opts.x, opts.y, opts.width, opts.width);
      break;
    }
    case 'triangle': {
      c.fillStyle = opts
      c.moveTo(opts.x1, opts.y1);
      c.lineTo(opts.x2, opts.y2);
      c.lineTo(opts.x3, opts.y3);
      c.lineTo(opts.x1, opts.y1);
    }
  
  }
  c.fill();
}


function undo() {
  var history = window.points.history;
  if( history.last > 1 ) {
    var step = history[history.last-1];
    c.putImageData(step.data, 0, 0);
    window.points = step.points.slice(0);
    window.points.history = history;
    window.points.history.last = history.last-1;
  } else {
    c.clearRect(0,0, width(), height());
    window.points = [];
    window.points.history = history;
    window.points.history.last = 0;
  }
  
}

function redo() {
  var history = window.points.history;
  if( history.last < history.length-1 ) {
    var step = history[history.last+1];
    c.putImageData(step.data, 0, 0);
    window.points = step.points.slice(0);
    window.points.history = history;
    window.points.history.last = history.last+1;
  }
}

function width() {
  return +$c.attr('width');
}

function height() {
  return +$c.attr('height'); 
}

function dataToBlob(data) {
  var binary = atob(data.split(',')[1]), array = [];
  var type = data.split(',')[0].split(':')[1].split(';')[0];
  for(var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
  return new Blob([new Uint8Array(array)], {type: type});
}


/*** END ***/

function startPoint(x, y) {

  // If no previous point exists, make the first one.
  if( !points.length ) points.push({x: x, y: y, type: '', start: {x: x, y: y}});

  var old = points[points.length-1],
      start = old.start,
      current = {
        x : x,
        y : y,
        start : old.start || {x: x, y: y},
        type : settings.type
      }
  // Line
  if( old.type !== 'line' && current.type == 'line' ) {
    window.o.beginPath();
    window.o.fillStyle = 'red';
    window.o.arc(x,y, 3, 0, 2*Math.PI);
    window.o.fill();
  }

  if( old.type == 'line' && current.type == 'line' ) {
    if( points[points.indexOf(old)-1].type !== 'line' ) {
      o.clearRect(old.x-3, old.y-3, 6, 6, true);
      draw(old.x, old.y, x, y);
    } else
      draw(old.x, old.y, x, y);
  }

  // Shapes

  if( old.type !== 'shape' && current.type == 'shape' ) {
    settings.shape.
  }

  var thresholds = window.mobile ? [10, 5] : [5, 2];
  if( points.length > 1 && ((start && threshold(start.x, start.y, x, y, thresholds[0])) || threshold(old.x, old.y, x, y, thresholds[1])) ) {
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
    case 'eraser': {
      capture.type = 'pen';
    }
    case 'pen': {
      draw(capture.x, capture.y, x, y);

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
      draw(capture.x, capture.y, x, y);
      var current = {
        x : x,
        y : y,
        start : capture.start,
        type : capture.type
      }
      points.push(current);

      for( var i = 0, len = points.length-1; i < len; i++ ) {
        if(threshold(points[i].x, points[i].y, current.x, current.y, settings.connectTelorance)) {
          var x = points[i].x - current.x,
              y = points[i].y - current.y;
          var w = settings.lineWidth/20 > 0.2 ? settings.lineWidth/20 : 0.2;

          draw(points[i].x - x*0.2, points[i].y - y*0.2, current.x + x*0.2, current.y + y*0.2, {strokeStyle: 'rgba(0,0,0,0.4)', lineWidth: w})
        }
      }
      break; 
    }
    case 'fur': {
      draw(capture.x, capture.y, x, y);
      var current = {
        x : x,
        y : y,
        start : capture.start,
        type : capture.type
      }
      points.push(current);

      for( var i = 0, len = points.length-1; i < len; i++ ) {
        if(threshold(points[i].x, points[i].y, current.x, current.y, settings.connectTelorance)) {
          var x = points[i].x - current.x,
              y = points[i].y - current.y;
          var l = settings.furLength / 100 || 0.2;
          var w = settings.lineWidth/20 > 0.2 ? settings.lineWidth/20 : 0.2;

          draw(points[i].x + x*l, points[i].y + y*l, current.x - x*l, current.y - y*l, {strokeStyle: 'rgba(0,0,0,0.4)', lineWidth: w})
        }
      }
      break;
    }
  }
}


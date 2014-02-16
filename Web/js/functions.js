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
  c.clear();
  c.putImageData(data, 0, 0);
}

function relative(x,y, el) {
  var el = el || $c,
      offset = el.offset();
  return {
    x : (x - offset.left) *window.devicePixelRatio,
    y : (y - offset.top) * window.devicePixelRatio
  }
}

function threshold(x1, y1, x2, y2, threshold) {
  var tr = threshold || 5;
  if( x1 <= x2 + tr && x1 >= x2 - tr && y1 <= y2 + tr && y1 >= y2 - tr ) return true; 
  return false;
}

function draw(x1, y1, x2, y2, opts, overlay) {
  opts = opts || {};
  if( overlay ) var c = window.o;
  else var c = window.c;
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
  if( !opts.noStroke || settings.noStroke ) c.stroke();
  if( opts.fill || settings.fill ) c.fill();
}

function mark(x, y) {
  var o = window.o;
  o.beginPath();
  o.fillStyle = 'red';
  o.arc(x,y, 3, 0, 2*Math.PI);
  o.fill();
}

function erase(x1, y1, x2, y2, opts) {
  var opts = opts || {};
  var c = window.c;
  c.beginPath();
  c.lineWidth = ( opts.lineWidth || settings.lineWidth ) / 10;
  c.globalCompositeOperation = 'source-out';
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  window.points = window.points.filter(function(e, i) {
    if(!threshold(e.x, e.y, x1, y1, c.lineWidth) &&
       !threshold(e.x, e.y, x2, y2, c.lineWidth) ) return true;
    return false;
  })
}

function line(x, y, opts) {
  var opts = opts || {};
  var o = window.o;
  o.beginPath();
  o.lineCap = opts.lineCap || settings.lineCap;
  o.lineJoin = opts.lineJoin || settings.lineJoin;
  o.strokeStyle = opts.color || settings.color;
  o.fillStyle = opts.color || settings.color;
  o.lineWidth = ( opts.lineWidth || settings.lineWidth ) / 10;
  var last = settings.drawingLine.length-1;
  o.moveTo(settings.drawingLine[last].x, settings.drawingLine[last].y);
  o.lineTo(x,y);
  settings.drawingLine.push({
    x: x,
    y: y
  })
  o.stroke();
  if( opts.fill || settings.fill ) o.fill();
}

function finishLine(opts) {
  var opts = opts || {};
  var c = window.c;
  o.clear();
  c.beginPath();
  c.strokeStyle = opts.color || settings.color;
  c.fillStyle = opts.color || settings.color;
  c.lineWidth = ( opts.lineWidth || settings.lineWidth ) / 10;
  c.lineJoin = opts.lineJoin || settings.lineJoin;
  c.lineCap = opts.lineJoin || settings.lineJoin;
  c.moveTo(settings.drawingLine[0].x, settings.drawingLine[0].y);
  for( var i = 1, len = settings.drawingLine.length; i < len; i++ ) {
    c.lineTo(settings.drawingLine[i].x, settings.drawingLine[i].y);
  }
  if( settings.stroke ) c.stroke();
  if( settings.fill ) c.fill();
  settings.drawingLine = [];
  window.points.history.push({
    data: c.getImageData(0, 0, width(), height()),
    points: window.points.slice(0)
  })
  window.points.history.last = window.points.history.length-1;
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
    c.clear();
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
    mark(x, y);
    settings.drawingLine.push({
      x: x,
      y: y
    })
  }

  if( old.type == 'line' && current.type == 'line' ) {
    if( points[points.indexOf(old)-1].type !== 'line' ) {
      o.clear();
    }
      line(x, y);
  }

  // Shapes

  if( current.type == 'shape' ) {
    settings.shapeStart = current;
  }

  var thresholds = window.mobile ? [10, 5] : [5, 2];
  if( points.length > 1 && ((start && threshold(start.x, start.y, x, y, thresholds[0])) || threshold(old.x, old.y, x, y, thresholds[1])) ) {
    window.active = false;
    points[points.length-1].type = '';
    points[points.length-1].start = undefined;
    finishLine();
    return;
  }
  points.push(current);
}

function drawPoint(x,y) {
  var capture = points[points.length-1];

  switch(capture.type) {
    case 'eraser': {
      erase(capture.x, capture.y, x, y);
    }
    case 'pencil': {
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
    case 'shape': {
      o.clear();
      o.beginPath();
      o.fillStyle = settings.color;
      o.strokeStyle = settings.color;
      o.lineWidth = settings.lineWidth / 20;
      var start = settings.shapeStart;
      switch(settings.shape) {
        case 'circle': {
          var di = Math.abs(x - start.x);
          o.arc(start.x, start.y, di, 0, 2*Math.PI);
          settings.comShape = {
            type: 'circle',
            x: start.x,
            y: start.y,
            radius: di
          }
          break;
        }
        case 'rectangle': {
          var w = x - start.x;
          var h = y - start.y;
          o.rect(start.x, start.y, w, h);
          settings.comShape = {
            type: 'rectangle',
            x: start.x,
            y: start.y,
            w: w,
            h: h
          }
          break;
        }
        case 'square': {
          var w = x - start.x;
          o.rect(start.x, start.y, w, w);
          settings.comShape = {
            type: 'rectangle',
            x: start.x,
            y: start.y,
            w: w,
            h: w
          }
          break;
        }
        case 'triangle': {
          var dix = (x - start.x)/2;
          var diy = (y - start.y)/2;
          o.moveTo(start.x + dix, start.y);
          o.lineTo(x, y);
          o.lineTo(start.x, y);
          o.lineTo(start.x + dix, start.y);
          settings.comShape = {
            type: 'triangle',
            start: {
              x: start.x,
              y: start.y
            },
            x: x,
            y: y,
            dix: dix,
            diy: diy
          }
        }
      }
      if( settings.fill ) o.fill();
      if( settings.stroke ) o.stroke();
      break;
    }
  }
}


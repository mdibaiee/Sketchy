"use strict";

$(document).ready(function() {
  window.c = $('canvas')[0].getContext('2d');
  window.o = $('canvas')[1].getContext('2d');

  window.settings = {
    lineWidth : 0.2,
    strokeStyle : 'black',
    type: 'sketch',
    lineCap: 'round',
    lineJoin: 'round',
    ribbonEnd: 50,
    ribbonTurn : 0
  };
  window.points = [];
  window.$c = $('canvas');
  window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}];

  sizeAndPos();
  $(window).resize(sizeAndPos);

  $c.last().bind('mousedown touchstart', function(e) {
    e.preventDefault();
    if( e.changedTouches ) e = e.changedTouches[0];
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).bind('mousemove touchmove', function(e) {
    e.preventDefault();
    if (!window.active || settings.type == 'line') return;
    if( e.changedTouches ) e = e.changedTouches[0];
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);
  }).bind('mouseup touchend', function(e) {
    e.preventDefault();
    window.active = false;

    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    window.points.history.push({
      data: c.getImageData(0, 0, $c.width(), $c.height()),
      points: window.points.slice(0)
    })
    window.points.history.last = window.points.history.length-1;
  })
  
})

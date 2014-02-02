"use strict";

$(document).ready(function() {
  window.c  = $('canvas')[0].getContext('2d');

  window.settings = {
    lineWidth : 5,
    strokeStyle : 'black',
    type: 'sketch',
    lineCap: 'round',
    lineJoin: 'round'
  };
  window.points = [];
  window.$c = $('canvas');

  sizeAndPos();
  $(window).resize(sizeAndPos);

  $c.bind('mousedown touchstart', function(e) {
    alert(e.pageX);
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).bind('mousemove touchmove', function(e) {
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);
  }).bind('mouseup touchend', function() {
    window.active = false;
  })
  
})

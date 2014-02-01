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

  $c.mousedown(function(e) {
    
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;

  }).mousemove(function(e) {

    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);

  }).mouseup(function() {

    window.active = false;

  })
  
})

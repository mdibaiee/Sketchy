"use strict";

$(document).ready(function() {
  window.c  = $('canvas')[0].getContext('2d');

  window.settings = {
    lineWidth : 1,
    strokeStyle : 'black',
    type: 'sketch',
    lineCap: 'round',
    lineJoin: 'round'
  };
  window.points = [];
  window.$c = $('canvas');

  sizeAndPos();
  $(window).resize(sizeAndPos);

  $c.bind('mousedown', function(e) {
    e.preventDefault();
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).bind('mousemove', function(e) {
    e.preventDefault();
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);
  }).bind('mouseup touchend', function(e) {
    e.preventDefault();
    window.active = false;
  }).bind('touchstart', function(e) {
    e.preventDefault();
    var touch = e.changedTouches[0];
    var xy = relative(touch.pageX, touch.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).bind('touchmove', function(e) {
    e.preventDefault();
    if(!window.active || settings.type =='line') return;
    var touch = e.changedTouches[0];
    var xy = relative(touch.pageX, touch.pageY);
    drawPoint(xy.x, xy.y);
    window.active = true;
  })
  
})

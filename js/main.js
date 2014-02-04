"use strict";

yepnope({
  test: window.mobile,
  yep : 'js/mobile-events.js',
  nope: 'js/events.js'
})

$(document).ready(function() {
  window.c = $('canvas')[0].getContext('2d');
  window.o = $('canvas')[1].getContext('2d');

  window.settings = {
    lineWidth : 0.2,
    strokeStyle : 'black',
    type: 'sketch',
    lineCap: 'round',
    lineJoin: 'round',
    furLength: 5
  };
  window.points = [];
  window.$c = $('canvas');
  window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}];

  sizeAndPos();
  $(window).resize(sizeAndPos);

})

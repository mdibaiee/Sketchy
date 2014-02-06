"use strict";

$(document).ready(function() {
  window.c = $('canvas')[0].getContext('2d');
  window.o = $('canvas')[1].getContext('2d');

  window.settings = {
    lineWidth : 2,
    color : 'black',
    type: 'sketch',
    lineCap: 'round',
    lineJoin: 'round',
    furLength: 5,
    connectTelorance: 40
  };
  window.points = [];
  window.$c = $('canvas');
  window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}];

  sizeAndPos();
  //$(window).resize(sizeAndPos);

  $('.color-picker').change(function() {
    var c = $(this).find('.color').val();
    settings.color = c;
    $('#setcolor span').html(c);
  })
  $('.color').val('#000000');

  yepnope({
    test: window.mobile,
    yep : ['js/mobile-events.js', 'js/libs/color-picker-touch.js'],
    nope: ['js/events.js', 'js/libs/color-picker.js']
  })

})

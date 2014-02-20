$(document).ready(function() {
  window.c = $('canvas')[0].getContext('2d');
  window.o = $('canvas')[1].getContext('2d');
  window.c.clear = window.o.clear = function() {
    this.clearRect(0, 0, width(), height());
  }
  window.settings = {
    stroke: true,
    fill: false,
    lineWidth : 2,
    color : 'black',
    bg: 'white',
    type: 'sketch',
    lineCap: 'round',
    lineJoin: 'round',
    furLength: 50,
    connectTelorance: 40,
    composite: 'source-over',
    shape: 'circle',
    shapeStart: {},
    comShape: {},
    drawingLine: [],
    version: 1.2
  };
  window.points = [];
  window.$c = $('canvas');
  window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}];
  window.points.history.last = 0;

  sizeAndPos();

  $('.color-picker').change(function() {
    var c = $(this).find('.color').val();
    var caller = $(this).parent().attr('data-caller');
    settings[caller] = c;
    $('#set' + caller + ' span').html(c);
    if( caller == 'bg' ) {
      $c.first().css('background', c);
    }
  })
  $('.color').val('#000000');
  
  if( localStorage.getItem('sawTips') != settings.version ) {
    $('.tour').removeClass('hidden');
    localStorage.setItem('sawTips', settings.version);
  }
})

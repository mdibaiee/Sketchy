"use strict";

$(document).ready(function() {

// Open External Links in browser

$('*').click(function(e) {
  e.preventDefault();
})

$('a[href^="http"]').on('tap', function(e) {
  e.preventDefault();
  var href = $(this).attr('href');
  var view = new MozActivity({
    name: 'view',
    data: {
      type: 'url',
      url: href
    }
  })
})

function save() {
  switch(save.background) {
    case 'white': {
      var cache = {
        fillStyle: c.color,
        composite: c.globalCompositeOperation
      }
      c.fillStyle = 'white';
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, width(), height());
      c.fillStyle = cache.fillStyle;
      c.globalCompositeOperation = cache.composite;
      break;
    }
    case 'current color': {
      var cache = {
        fillStyle: c.color,
        composite: c.globalCompositeOperation
      }
      c.fillStyle = settings.strokeStyle;
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, width(), height());
      c.fillStyle = cache.fillStyle;
      c.globalCompositeOperation = cache.composite;
      break;
    }
  }
  var data = $c[0].toDataURL(); 
  var file = dataToBlob($c[0].toDataURL());
  var pics = navigator.getDeviceStorage('pictures');
  var r = pics.addNamed(file, save['file name'] + '.png');
  r.onsuccess = function() {
    alert('Your sketch was successfuly saved to ' + this.result); 
  }
  r.onerror = function() {
    alert('Something bad happened when we tried to save your file\n Possible problems: \n Duplicate name \n Permission problems')
    console.warn(this.error);
  }
  c.putImageData(window.points.history[window.points.history.last].data, 0, 0);
}

  $('.menu').tap(function() {
    $('#menu').toggleClass('pulled');
  })
  $('.save').tap(function() {
    $('#save').removeClass('hidden');
  })
  $c.last().on('touchstart', function(e) {
    var xy = relative(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).on('touchmove', function(e) {
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    drawPoint(xy.x, xy.y);
  }).on('touchend', function(e) {
    window.active = false;
    if( settings.type == 'eraser' ) return;

    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    window.points.history.push({
      data: c.getImageData(0, 0, width(), height()),
      points: window.points.slice(0)
    })
    window.points.history.last = window.points.history.length-1;
  }).on('longTap', function(e) {
    if( points[points.length-1].type == 'line' ) {
      window.active = false;
      points[points.length-1].type = '';
      points[points.length-1].start = undefined;
    }
  })
  
  // Value Selector
  
  var $single = $('form[data-type="value-selector"].single');

  $single.find('li').tap(function(e) {
    e.preventDefault();
    $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
    var key = $(this).parents('form').attr('id'),
        value  = $(this).find('label span').html().toLowerCase();
    window.settings[key] = value;

    $('button[id="set' + key + '"] span').html(value[0].toUpperCase() + value.substr(1));
    $('#menu div.options > div').addClass('hidden');
    $('#menu div.options > .general, #menu div.options > .'+value).removeClass('hidden');

    $(this).parents('form').addClass('hidden');
  })

  $single.find('button').tap(function(e) {
    e.preventDefault();
    $(this).parents('form').addClass('hidden');
  })

  // Confirm

  var $confirm = $('form[data-type="value-selector"].confirm');

  $confirm.find('li').tap(function(e) {
    $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
  })
  $confirm.find('button').last().tap(function(e) {
    e.preventDefault();
    var v = $(this).parents('form').attr('id');
    $(this).parents('form').find('h1').each(function(i) {
      if( i > 0 ) {
        var key = $(this).html().toLowerCase();
        var value = $(this).parent().find('ol:nth-of-type('+i+') li[aria-selected] span').html();
        if( key !== 'file name' ) value = value.toLowerCase();
        
        window[v][key] = value;
      }
    })
    $(this).parents('form').addClass('hidden');
    window[v]();
  })
  $confirm.find('button').first().tap(function(e) {
    e.preventDefault();
    $(this).parents('form').addClass('hidden');
  })

  // Value Selector Callers
  
  var $btn = $('button[id^="set"]');
  $btn.each(function() {
    var target = /set(.*)/.exec($(this).attr('id'))[1];
    if( target == 'color' ) {
      return $(this).tap(function() {
        $('.picker').removeClass('hidden');
      })
    }
    $(this).tap(function(e) {
      e.preventDefault();
      $('form[id="' + target + '"]').removeClass('hidden');
    })
  })

  // Seekbar

  var sliderLeft;
  $('div[role="slider"] button').on('touchstart', function() {
    $(this).attr('data-moving','true');
    if( !sliderLeft ) sliderLeft = $('div[role="slider"] button').offset().left;
  }).on('touchmove', function(e) {
      if( $(this).attr('data-moving') ) {
      var x = parseInt(e.changedTouches[0].pageX - sliderLeft - 15);
      var $c = $('.'+$(this).parents('div[role="slider"]').attr('class'));
      var progress = $c.find('progress');
      var max = +progress.attr('max');
      var min = +progress.attr('min');
      if( x <= max && x >= min ) {
        $c.find('button').css('left', x+'%');
        progress.attr('value', x);
        var key = $c.attr('class');
        settings[key] = x;
        $('#'+ key +' span').html(x);
      }
    }
  }).on('touchend', function() {
    $(this).removeAttr('data-moving');
  })

  // Color Picker
  
  $('.close').tap(function() {
    $(this).parent().addClass('hidden');
  })

  // Bottom

  $('#clear').tap(function() {
    c.clearRect(0, 0, width(), height());
    var h = window.points.history;
    window.points = [];
    window.points.history = h;
    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    window.points.history.push({
      data: c.getImageData(0, 0, width(), height()),
      points: []
    })
    window.points.history.last = window.points.history.length-1;
  })

  $('#undo').tap(undo);
  $('#redo').tap(redo);

  $('#about').tap(function() {
    $('.about').removeClass('hidden');
  })

});

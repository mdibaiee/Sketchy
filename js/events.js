"use strict";

function save() {
  switch(save.background) {
    case 'white': {
      var cache = {
        color: c.color,
        composite: c.globalCompositeOperation
      }
      c.fillStyle = 'white';
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, $c.width(), $c.height());
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
      c.fillRect(0, 0, $c.width(), $c.height());
      c.fillStyle = cache.fillStyle;
      c.globalCompositeOperation = cache.composite;
      break;
    }
  }
  var data = $c[0].toDataURL();
  window.open(data, save['file name']);

  c.putImageData(window.points.history[window.points.history.length-1].data, 0, 0);

}

  $('.menu').click(function() {
    $('#menu').toggleClass('pulled');
  })
  $('.save').click(function() {
    $('#save').removeClass('hidden');
  })
  $c.last().on('mousedown', function(e) {
    e.preventDefault();
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).on('mousemove', function(e) {
    e.preventDefault();
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);
  }).on('mouseup', function(e) {
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
  
  // Value Selector
  
  // Single
  
  var $single = $('form[data-type="value-selector"].single');

  $single.find('li').click(function(e) {
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
  $single.submit(function(e) {
    e.preventDefault();
    $(this).addClass('hidden');
  })

  // Confirm
  
  var $confirm = $('form[data-type="value-selector"].confirm');

  $confirm.find('li').click(function(e) {
    $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
  })
  $confirm.find('button').last().click(function(e) {
    e.preventDefault();
    var v = $(this).parents('form').attr('id');
    $(this).parents('form').find('h1').each(function(i) {
      if( i > 0 ) {
        var key = $(this).html().toLowerCase();
        var value = $(this).parent().find('ol:nth-of-type('+i+') li[aria-selected] span').html();
        if( key !== 'file name' ) value = key.toLowerCase();
        
        window[v][key] = value;
      }
    })
    $(this).parents('form').addClass('hidden');
    window[v]();
  })
  $confirm.find('button').first().click(function(e) {
    e.preventDefault();
    $(this).parents('form').addClass('hidden');
  })

  // Value Selector Callers
  
  var $btn = $('button[id^="set"]');
  $btn.each(function() {
    var target = /set(.*)/.exec($(this).attr('id'))[1];
    // Exception for Color
    if( target == 'color' ) {
      return $(this).click(function() {
        $('.picker').removeClass('hidden');
      })
    }
    $(this).click(function(e) {
      e.preventDefault();
      $('form[id="' + target + '"]').removeClass('hidden');
    })
  })

  // Seekbar

  var sliderLeft;
  $('div[role="slider"] button').on('mousedown', function() {
    $(this).attr('data-moving','true');
    if( !sliderLeft ) sliderLeft = $('div[role="slider"] button').offset().left;
  }).on('mousemove', function(e) {
    if( $(this).attr('data-moving') ) {
      var x = parseInt(e.pageX - sliderLeft - 15);
      var progress = $(this).parent().children().first();
      var max = +progress.attr('max');
      var min = +progress.attr('min');
      if( x <= max && x >= min ) {
        $(this).css('left', x+'%');
        $(this).parent().find('progress').attr('value', x);
        var key = $(this).parents('div[role="slider"]').attr('class');
        settings[key] = x;
        $('#'+ key +' span').html(x);
      }
    }
  }).on('mouseup mouseleave', function() {
    $(this).removeAttr('data-moving');
  })


  // Color Picker
  
  $('#closePicker').click(function() {
    $('.picker').addClass('hidden');
  })

  // Bottom

  $('#clear').click(function() {
    c.clearRect(0, 0, $c.width(), $c.height());
    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    window.points.history.push({
      data: c.getImageData(0, 0, $c.width(), $c.height()),
      points: []
    })
    window.points.history.last = window.points.history.length-1;
  })

  $('#undo').click(undo);
  $('#redo').click(redo);


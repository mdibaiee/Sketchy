"use strict";

$(document).ready(function() {
  $('.menu').on('click tap', function() {
    $('#menu').toggleClass('pulled');
  })
  $('.save').on('click tap', function() {
    $('#save').removeClass('hidden');
  })
  $('.load').on('click tap', function() {
    $('#load').removeClass('hidden');
    $('#load li, #load p').remove();
    var list = JSON.parse(localStorage.getItem('projects'));
    if( !list || list.length < 1 ) {
      $('#load ol').append(
        $('<p>No sketch found.</p>')
      );
      return;
    }
    for( var i = 0, len = list.length; i < len; i++ ) {
      $('#load ol').append(
        $('<li><label><span>' + list[i].name + '</span></label></li>')
      );
    }
    
    $confirm.find('li').off('click').on('click tap', function(e) {
      $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
      $(this).attr('aria-selected', 'true');
    })
    $('#pro').on('click tap', function() {
      $('#save ol:nth-of-type(2) li').each(function() {
        if( $(this).find('span').html() !== 'Current Color' ) {
          $(this).addClass('hidden');
          $(this).removeAttr('aria-selected');
        }
        else $(this).attr('aria-selected', 'true');
      })
    })
    $('#exp').on('click tap', function() {
      $('#save ol:nth-of-type(2)').removeClass('hidden');
    })
  })
  $('#pro').on('click tap', function() {
    $('#save ol:nth-of-type(2) li').each(function() {
      if( $(this).find('span').html() !== 'Current Color' ) {
        $(this).addClass('hidden');
        $(this).removeAttr('aria-selected');
      }
      else $(this).attr('aria-selected', 'true');
    })
  })
  $('#exp').on('click tap', function() {
    $('#save ol:nth-of-type(2) li').removeClass('hidden');
  })
  $c.last().on('mousedown touchstart', function(e) {
    e.preventDefault();
    if( e.changedTouches )
      e = e.changedTouches[0];
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).on('mousemove touchmove', function(e) {
    e.preventDefault();
    if( e.changedTouches )
      e = e.changedTouches[0];
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);
  }).on('mouseup touchend', function(e) {
    e.preventDefault();
    window.active = false;
  
  
    if( settings.type == 'eraser' ) return;
    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    if( settings.type == 'shape' ) {
      var s = settings.comShape;
      o.clear();
      c.beginPath();
      c.fillStyle = settings.color;
      c.strokeStyle = settings.color;
      c.lineWidth = settings.lineWidth / 20;
      switch(s.type) {
        case 'circle': {
          c.arc(s.x, s.y, s.radius, 0, 2*Math.PI);
          break;
        }
        case 'rectangle': {
          c.rect(s.x, s.y, s.w, s.h)
          break;
        }        
        case 'triangle': {
          c.moveTo(s.start.x + s.dix, s.start.y);
          c.lineTo(s.x, s.y);
          c.lineTo(s.start.x, s.y);
          c.lineTo(s.start.x + s.dix, s.start.y);
          break;
        }  
      }
      if( settings.fill ) c.fill();
      if( settings.stroke ) c.stroke();
    }

    if( settings.type == 'line' ) return;

    window.points.history.push({
      data: c.getImageData(0, 0, width(), height()),
      points: window.points.slice(0)
    })
    window.points.history.last = window.points.history.length-1;
  }).on('longTap', function(e) {
    if( settings.type == 'line' ) {
      e.preventDefault();
      window.active = false;
      points[points.length-1].type = '';
      points[points.length-1].start = undefined;
      finishLine();
    }
  })
  
  // Value Selector
  
  // Single
  
  var $single = $('form.single');

  $single.find('li').on('click tap', function(e) {
    $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
    var key = $(this).parents('form').attr('id'),
        value  = $(this).find('label span').html().toLowerCase(),
        target = $(this).attr('data-target');
    window.settings[key] = value;

    $('button[id="set' + key + '"] span').html(value[0].toUpperCase() + value.substr(1));
    if( target ) {
      $('#menu div.options > div').addClass('hidden');
      $('#menu div.options > .general, #menu div.options > .'+target).removeClass('hidden');
    }
    $(this).parents('form').addClass('hidden');
  })
  $single.submit(function(e) {
    e.preventDefault();
    $(this).addClass('hidden');
  })

  // Confirm
  
  var $confirm = $('form.confirm');

  $confirm.each(function() {
  
    $(this).find('li').on('click tap', function(e) {
      $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
      $(this).attr('aria-selected', 'true');
    })
    $(this).find('button').last().on('click tap', function(e) {
      e.preventDefault();
      var v = $(this).parents('form').attr('id');
      $(this).parents('form').find('h1').each(function(i) {
        if( i > 0 ) {
          var key = $(this).html().toLowerCase();
          var value = $(this).parent().find('ol:nth-of-type('+i+') li[aria-selected] span').html();
          if( key !== 'file name' && key !== 'file' ) value = value.toLowerCase();
          window[v][key] = value;
        }
      })
      $(this).parents('form').addClass('hidden');
      window[v]();
    })
    $(this).find('button').first().on('click tap', function(e) {
      e.preventDefault();
      $(this).parents('form').addClass('hidden');
    })
  
  })

  // Value Selector Callers
  
  var $btn = $('button[id^="set"]');
  $btn.each(function() {
    var target = /set(.*)/.exec($(this).attr('id'))[1];
    // Exception for Color
    if( target == 'color' || target == 'bg' ) {
      return $(this).on('click tap', function() {
        $('.picker').removeClass('hidden');
        $('.picker').attr('data-caller', target);
        setTimeout(function() {
          $('body').on('click tap', 'canvas, #menu, header', function() {
            $('.picker').addClass('hidden');
            $('body').off('click tap');
          })
        }, 500);
      })
    }
    $(this).on('click tap', function(e) {
      e.preventDefault();
      $('form[id="' + target + '"]').removeClass('hidden');
    })
  })

  // Seekbar

  var sliderLeft;
  $('div[role="slider"] button').on('mousedown touchstart', function() {
    $(this).attr('data-moving','true');
    if( !sliderLeft ) sliderLeft = $('div[role="slider"] button').offset().left;
  }).on('mousemove touchmove', function(e) {
    if( $(this).attr('data-moving') ) {
      if( e.changedTouches )
        e = e.changedTouches[0];
      var x = parseInt(e.pageX - sliderLeft - 15);
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
  }).on('mouseup mouseleave touchend', function() {
    $(this).removeAttr('data-moving');
  })

  $('.fill, .stroke').on('click tap', function() {
    var s = $('.'+$(this).attr('class')).find('span');
    if( s.html() == 'Yes' ) {
      s.html('No');
      settings[$(this).attr('class')] = false;
    } else {
      s.html('Yes');
      settings[$(this).attr('class')] = true;
    }
  })
  
  $('.close, .tour button, .vote button').on('click tap', function() {
    $(this).parent().addClass('hidden');
    $('body').off('click tap');
  })

  // Bottom

  $('#clear').on('click tap', function() {
    c.clear();
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

  $('#undo').on('click tap', undo);
  $('#redo').on('click tap', redo);

  $('#about').on('click tap', function() {
    $('.about').removeClass('hidden');
  })

  if( window.mobile ) $('*').on('click mousemove mousedown mouseup mouseleave', function() {return false;});

})




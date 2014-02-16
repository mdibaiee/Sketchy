"use strict";

$(document).ready(function() {

// Open External Links in browser

$('*').click(function(e) {
  e.preventDefault();
})

$('a[href^="http"]').tap(function(e) {
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

$('a[href^="mailto"]').tap(function(e) {
  e.preventDefault();
  var mail = /mailto:(.*)/.exec($(this).attr('href'))[1];
  var mail = new MozActivity({
    name: 'new',
    data: {
      type: 'mail',
      url: mail
    }
  })
})

window.save = function() {
  switch(save.background) {
    case 'white': {
      c.fillStyle = 'white';
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, width(), height());
      c.fillStyle = settings.color;
      c.globalCompositeOperation = settings.composite;
      break;
    }
    case 'current color': {
      c.fillStyle = settings.bg;
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, width(), height());
      c.globalCompositeOperation = settings.composite;
      break;
    }
  }
  var data = $c[0].toDataURL(); 
  if( save.type == 'sketchy project' ) {
    if( localStorage.getItem(save['file name']) ) {
      if( confirm('A sketch with this name already exists. Do you want to overwrite ' + save['file name']) + '?' ) {
        localStorage.setItem(save['file name'], JSON.stringify({data: data, points: window.points}));
      }
    }
    else
      localStorage.setItem(save['file name'], JSON.stringify({data: data, points: window.points})); 
  } else {
    var file = dataToBlob($c[0].toDataURL());
    var pics = navigator.getDeviceStorage('pictures');
    var r = pics.addNamed(file, save['file name'] + '.png');
    r.onsuccess = function() {
      alert('Your sketch was successfuly saved to ' + this.result); 
    }
    r.onerror = function() {
      alert('Something bad happened when we tried to save your file\n Possible problems: \n Duplicate name \n Permission problems')
    }
  }
  c.putImageData(window.points.history[window.points.history.last].data, 0, 0);
}
window.load = function() {
  var file = JSON.parse(localStorage.getItem(load.file));
  var img = document.createElement('img');
  img.src = file.data;
  console.log(file.data);
  img.onload = function() {
    c.clearRect(0, 0, width(), height());
    c.drawImage(img, 0, 0);
    window.points = file.points;
    window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}, { data: c.getImageData(0, 0, width(), height()), points: file.points}];
  }
}

  $('.menu').tap(function() {
    $('#menu').toggleClass('pulled');
  })
  $('.save').tap(function() {
    $('#save').removeClass('hidden');
  })
  $('.load').tap(function() {
    $('#load').removeClass('hidden');
    $('#load li').remove();
    for( var i = 0, len = localStorage.length; i < len; i++ ) {
      $('#load ol').append(
        $('<li><label><span>' + localStorage.key(i) + '</span></label></li>')
      );
    }
    if( localStorage.length < 1 ) {
      $('#load ol').append(
        $('<p>No Sketch found.</p>')
      );
    }
    $confirm.find('li').off('tap').tap(function(e) {
      $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
      $(this).attr('aria-selected', 'true');
    })
  })
  $('#pro').tap(function() {
    $('#save ol:nth-of-type(2) li').each(function() {
      if( $(this).find('span').html() !== 'Transparent' ) {
        $(this).addClass('hidden');
        $(this).removeAttr('aria-selected');
      }
      else $(this).attr('aria-selected', 'true');
    })
  })
  $('#exp').tap(function() {
    $('#save ol:nth-of-type(2) li').removeClass('hidden');
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
      finishLine();
    }
  })
  
  // Value Selector
  
  var $single = $('form[data-type="value-selector"].single');

  $single.find('li').tap(function(e) {
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

  var $confirm = $('form[data-type="value-selector"].confirm');

  $confirm.each(function() {
  
    $(this).find('li').tap(function(e) {
      $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
      $(this).attr('aria-selected', 'true');
    })
    $(this).find('button').last().tap(function(e) {
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
    $(this).find('button').first().tap(function(e) {
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
      return $(this).tap(function() {
        $('.picker').removeClass('hidden');
        $('.picker').attr('data-caller', target);
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

  $('.fill, .stroke').tap(function() {
    var s = $('.'+$(this).attr('class')).find('span');
    if( s.html() == 'Yes' ) {
      s.html('No');
      settings[$(this).attr('class')] = false;
    } else {
      s.html('Yes');
      settings[$(this).attr('class')] = true;
    }
  })
  
  $('.close, .tour button').tap(function() {
    $(this).parent().addClass('hidden');
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

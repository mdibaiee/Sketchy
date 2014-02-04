  $('.menu').click(function() {
    $('#menu').toggleClass('pulled');
  })
  $('.save').click(function() {
    var data = $c[0].toDataURL();
    var img = $('<img src="' + data + '" width="' + $c.width() + '" height="' + $c.height() + '" class="overlay"/>');
    $('body').append(img);
  })
  $c.last().bind('mousedown', function(e) {
    e.preventDefault();
    var xy = relative(e.pageX, e.pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).bind('mousemove', function(e) {
    e.preventDefault();
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.pageX, e.pageY);
    drawPoint(xy.x, xy.y);
  }).bind('mouseup mouseout', function(e) {
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
  
  var $selector = $('form[data-type="value-selector"]');

  $selector.find('li').on('mouseup', function(e) {
    alert(e.type);
    $(this).parent().find('li').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
    var prop = $(this).parents('form').attr('id'),
        key  = $(this).find('label span').html().toLowerCase();
    window.settings[prop] = key;

    $('button[id="set' + prop + '"] span').html(key[0].toUpperCase() + key.substr(1));

    $(this).parents('form').addClass('hidden');
  })

  $selector.submit(function(e) {
    e.preventDefault();
    $(this).addClass('hidden');
  })

  // Value Selector Callers
  
  var $btn = $('button[id^="set"]');
  $btn.each(function() {
    var target = /set(.*)/.exec($(this).attr('id'))[1];
    $(this).on('mouseup', function(e) {
      e.preventDefault();
      $('form[id="' + target + '"]').removeClass('hidden');
    })
  })

  // Seekbar

  var sliderLeft = $('div[role="slider"] button').offset().left;
  $('div[role="slider"] button').on('mousedown', function() {
    $(this).attr('data-moving','true');
  }).on('mousemove', function(e) {
    if( $(this).attr('data-moving') ) {
      var x = e.pageX - sliderLeft - 15;
      if( x <= 100 && x > 0 ) {
        $(this).css('left', x+'%');
        $(this).parent().find('progress').attr('value', x);
        settings.lineWidth = x / 10;
        $('#lineWidth span').html(x);
      }
    }
  }).on('mouseup mouseleave', function() {
    $(this).removeAttr('data-moving');
  })

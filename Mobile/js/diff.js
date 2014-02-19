$(document).ready(function() {

  $('*').off('click mousemove mousedown mouseup mouseleave').on('click mousemove mousedown mouseup mouseleave', function(e) {
    e.preventDefault;
    return false;
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
      var list = JSON.parse(localStorage.getItem('projects'));
      var index;
      if( list && list.some(function(a, i) { if( a.name == save['file name'] ) {index = i; return true} return false }) ) {
        if( confirm('A sketch with this name already exists. Do you want to overwrite ' + save['file name']) + '?' ) {
          console.log(index);
          list[index] = {
            name: save['file name'],
            data: data,
            points: window.points,
            settings: settings
          }
          localStorage.setItem('projects', JSON.stringify(list));
        }
      }
      else
        list ? list.push({
            name: save['file name'],
            data: data,
            points: window.points
          }) : list = [{
            name: save['file name'],
            data: data,
            points: window.points
          }];
        localStorage.setItem('projects', JSON.stringify(list)); 
      } else {
        window.open(data, '_blank').focus();
      }

      c.putImageData(window.points.history[window.points.history.last].data, 0, 0);
    }

  window.load = function() {
      var file = JSON.parse(localStorage.getItem('projects')).filter(function(a) { return a.name == load.file })[0];
      var img = document.createElement('img');
      img.src = file.data;
      img.onload = function() {
        c.clearRect(0, 0, width(), height());
        c.drawImage(img, 0, 0);
        window.points = file.points;
        window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}, { data: c.getImageData(0, 0, width(), height()), points: file.points}];
        $c.first().css('background', file.settings.bg);
        window.settings.bg = file.settings.bg;
      }
    }

  if( localStorage.getItem('sawTips') != settings.version ) {
    $('.tour').removeClass('hidden');
    localStorage.setItem('sawTips', settings.version);
  }

})

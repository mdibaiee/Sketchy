$(document).ready(function() {

  $('*').off('click mousemove mousedown mouseup mouseleave').on('click mousemove mousedown mouseup mouseleave', function(e) {
    e.preventDefault;
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
    return false;
  }).click(function(e) {
    e.preventDefault();
    return false;
  })

  $('a[href^="mailto"]').tap(function(e) {
    e.preventDefault();
    var mail = new MozActivity({
      name: 'new',
      data: {
        type: 'mail',
        url: $(this).attr('href')
      }
    })
    return false;
  }).click(function(e) {
    e.preventDefault();
    return false;
  })

  window.save = function() {
    var f = c.getImageData(0, 0, width(), height());
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
        if( confirm('A sketch with this name already exists. Do you want to overwrite ' + save['file name'] + '?') ) {
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
      else {
        list ? list.push({
            name: save['file name'],
            data: data,
            points: window.points,
            settings: settings
          }) : list = [{
            name: save['file name'],
            data: data,
            points: window.points,
            settings: settings
          }];
        localStorage.setItem('projects', JSON.stringify(list)); 
      }         
    } else {
      var sd = navigator.getDeviceStorage('pictures');
      var file = dataToBlob(data);
      var req = sd.addNamed(file, save['file name'] + '.png');
      req.onsuccess = function() {
        alert('Your Sketch was saved successfuly: ' + this.result);
      }
      req.onerror = function(e) {
        alert('Something bad happened trying to save your sketch ' + save['file name'] + '\n Possible reasons:\n Duplicate Name \n Not enough permission')
      }
    }
    c.putImageData(f, 0, 0);
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

  if( !localStorage.getItem('sawVote') ) {
    $('.vote').removeClass('hidden');
    localStorage.setItem('sawVote', true);
  }

})

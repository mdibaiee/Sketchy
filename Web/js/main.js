"use strict";

$(document).ready(function() {

  yepnope({
    test: window.mobile,
    yep : ['js/mobile.js', 'js/libs/color-picker-touch.js'],
    nope: ['js/libs/color-picker.js']
  })

  $(window).resize(sizeAndPos);

  function save() {
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

  function load() {
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
  window.load = load;
  window.save = save;

  // TODO: Check for Update

  /*var request = navigator.mozApps.getInstalled();
  request.onsuccess = function() {
    var app = this.result[0];
    var latest = $.ajax({url:'manifest-web.webapp'});
    var selfApp = navigator.mozApps.getSelf();
    selfApp.onsuccess = function() {
      if(this.result) {
        latest.onload = function() {
          if( this.response ) {
            var lapp = JSON.parse(this.response);
            alert(lapp.version);
            alert(app.manifest.version);
            if( lapp.version != app.manifest.version && 
            confirm('A new version of this app is available, do you want to update?')) {
              var ins = navigator.mozApps.install();
              ins.onsuccess = function() {
                alert('The app was installed successfuly');
              }
              ins.onerror = function() {
                alert('There was an error installing app - ' + this.error.name)
              }
            }
          }
        }
      }
    }
    if( !app && confirm('Do you want to Install this app?') ) {
      var ins = navigator.mozApps.install('http://mdibaiee.github.io/Sketchy/Web/manifest-web.webapp');
      ins.onsuccess = function() {
        alert('The app was installed successfuly');
      }
      ins.onerror = function() {
        alert('There was an error installing app')
        console.log(this.error);
      }
    }
  }
  request.onerror = function() {
    alert('An error occured while trying to check for updates');
  }*/

})

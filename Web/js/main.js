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
    connectTelorance: 40,
    composite: 'source-over'
  };
  window.points = [];
  window.$c = $('canvas');
  window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}];
  window.points.history.last = 0;

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
    yep : ['js/libs/touch.js', 'js/mobile.js', 'js/libs/color-picker-touch.js'],
    nope: ['js/desktop.js', 'js/libs/color-picker.js']
  })


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
        c.fillStyle = settings.color;
        c.globalCompositeOperation = 'destination-over';
        c.fillRect(0, 0, width(), height());
        c.fillStyle = settings.color;
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
      window.open(data, '_blank').focus();
    }

    c.putImageData(window.points.history[window.points.history.last].data, 0, 0);
  }

  function load() {
    var file = JSON.parse(localStorage.getItem(load.file));
    var img = document.createElement('img');
    img.src = file.data;
    img.onload = function() {
      c.clearRect(0, 0, width(), height());
      c.drawImage(img, 0, 0);
      window.points = file.points;
      window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}, { data: c.getImageData(0, 0, width(), height()), points: file.points}];
    }
  }
  window.load = load;
  window.save = save;

  // Check for Update

  var request = navigator.mozApps.checkInstalled('mdibaiee.github.io/Sketchy/Web/manifest-web.webapp');
  request.onsuccess = function() {
    if( !this.result && confirm('A new version is available, do you want to update?') ) {
      var ins = navigator.mozApps.install('mdibaiee.github.io/Sketchy/Web/manifest-web.webapp');
      ins.onsuccess = function() {
        alert('The app was installed successfuly');
      }
      ins.onerror = function() {
        alert('There was an error installing app')
      }
    }
  }
  request.onerror = function() {
    alert('An error occured while trying to check for updates');
  }

  

})

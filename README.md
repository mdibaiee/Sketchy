Sketchy
=======

Free Sketch / Paint application for Firefox with a lot of features.

Key features:
* Different types of brushes 
* Customizable brushes 
* Colorpicker 
* Unlimited Undo/Redo 
* Save your sketch to sdcard / PC
* Save your sketch as a "Sketchy Project" and edit it later
* Different shapes ( Circle, Rectangle, Square, Triangle )
* Fill / Stroke

New features are coming soon! Contact and tell us what feature you would like to see in next version ( you can make an issue ).

Found a bug? Make an issue and I'll fix it as soon as possible.

Web version: https://mdibaiee.github.io/Sketchy/build/web/

Firefox Marketplace: https://marketplace.firefox.com/app/sketchy/

Start
=====

To start working on:

  git clone https://github.com/mdibaiee/Sketchy
  cd Sketchy
  npm install
  grunt

Sketchy will be built to "build" folder, you can run `grunt watch` to automatically re-run tasks when you modify files.

Known Issues
============

* Memory leak

Changelog
=========

**1.2**
* Added an option to save sketches as a project, so they are editable later
* Added an option to change board's color ( Background )
* Added Shapes (Circle, Rectangle, Square, Triangle)
* Added Fill/Stroke option for Lines and Shapes )
* Made Line Join working ( was disabled in version 1.1 )

**1.1**
* Added "About"
* No load-time for Mobile
* Added preloader for images
* Fixed low lineWidth for sketches rendering invisible in Chrome
* Fixed background settings not applying ( save )
* Fixed Email link not working on Mobile

License
=======

GPL v2

Copyright (C) 2014 Mahdi Dibaiee

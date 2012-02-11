(function( $, root ){

/*
* requestAniFrame() shim from the lovely and talented Paul Irish
*   http://paulirish.com/2011/requestanimationframe-for-smart-animating/
*/
root.requestAnimFrame = (function(){
  return  root.requestAnimationFrame       ||
          root.webkitRequestAnimationFrame ||
          root.mozRequestAnimationFrame    ||
          root.oRequestAnimationFrame      ||
          root.msRequestAnimationFrame     ||
          function( callback ){
            setTimeout(callback, 1000 / 60);
          };
})();

function Qanvas( options ){

  if( ! this instanceof Qanvas )
    return new Qanvas( options );

  var settings = this.settings = $.extend({}, this.defaultOptions, options);

  var props = {
    id: settings.name,
    width: settings.width,
    height: settings.height,
    style: settings.style
  };

  // create the canvas element
  this.$canvas = $('<canvas/>', props);
  this.canvas = this.$canvas[0];
  this.ctx = this.canvas.getContext('2d');

  if( $.isFunction( settings.render ) )
    this.render = $.proxy( settings.render, this );

  if( $.isFunction( settings.initialize ) )
    this.initialize = $.proxy( settings.initialize, this );

  this.initialize();

}

Qanvas.prototype.initialize = function(){
  this.resize();
  this.$canvas.appendTo( this.settings.target );
  return this.render();
};

Qanvas.prototype.defaultOptions = {
  name: 'qanvas-' +new Date(),
  style: '',
  width: 200,
  height: 200,
  target: $('body'),
  initialize: false
};

Qanvas.prototype.render = function(){};

Qanvas.prototype.resize = function( width, height, callback ){
  this.canvas.width = this.settings.width = width || this.settings.width;
  this.canvas.height = this.settings.height = height || this.settings.height;

  this.render();
  if( $.isFunction( callback )) callback.call( this );
};

Qanvas.prototype.clear = function( width, height ){
  this.ctx.clearRect(0,0, width || this.settings.width, height || this.settings.height);
  return this;
};

root.Qanvas = root.qanvas = Qanvas;

})( jQuery, window );

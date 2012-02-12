/*jshint onevar: false */
(function( Image, $ ) {

  var ImageController = Backbone.View.extend({
    tagName: 'li',

    parent: $('#images'),

    initialize: function(){
      var dfd = this.dfd = new $.Deferred();
      this.model.collection.dfds.push( dfd );
    },

    render: function(){
      this.$el.html( JST.image( this.model.toJSON() ) );
      this.parent.append( this.el );

      var
        _this = this,
        img   = this.$('img');

      img.imagesLoaded(function(){
        // detect for gifs
        if( /(?=\.gif)/.test( _this.model.get('Key') ) )
          _this.$el.addClass('gif');
          _this.processGif( img );

        _this.dfd.resolve();

      });
    },

    processGif: function( img ){

      var params = {
        width: img.width(),
        height: img.height(),
        target: img.parent()
      };

      params.render = function(){
        this.ctx.drawImage( img[0], 0, 0, params.width, params.height );
      };

      var q = new qanvas( params );

      img.addClass('ui-hidden');

    }
  });

  Image.Model = Backbone.Model.extend({
    initialize: function(){
      this.view = new ImageController({ model: this });
      this.view.render();
    }
  });

  Image.Collection = Backbone.Collection.extend({
    url: '/list',

    initialize: function(){
      this.deferred = this.fetch();
    },

    model: Image.Model,

    dfds: []
  });

  module.exports = Image;

})( this.Cloudy.module('image'), jQuery );

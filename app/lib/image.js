/*jshint onevar: false */
(function( Image, $ ) {

  var Backbone = require('backbone');

  var ImageController = Backbone.View.extend({
    tagName: 'li',

    parent: $('#images'),

    initialize: function(){

    },

    render: function(){
      $(this.el).html( JST.image( this.model.toJSON() ) );
      this.parent.append( this.el );
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

    model: Image.Model
  });

  Image.collection = new Image.Collection();

})( this.Cloudy.module('image'), jQuery );

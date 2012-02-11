
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"index": function(exports, require, module) {require('lib/namespace');
require('lib/image');
}, "lib/image": function(exports, require, module) {/*jshint onevar: false */
(function( Image, $ ) {

  var ImageController = Backbone.View.extend({
    tagName: 'li',

    parent: $('#images'),

    initialize: function(){

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
          _this.processGif( img );

      });
    },

    processGif: function( img ){

      this.$el.addClass('gif');

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

    model: Image.Model
  });

  var collection = Image.collection = new Image.Collection();

  collection.deferred.done(function(){

    $('#images').isotope({
      itemSelector : 'li'
    });

    $('#loader').delay(200).fadeOut(800);

    $('#filter-gifs').click(function(){
      $('#images').isotope({ filter: '.gif' });
      return false;
    });
  });

})( this.Cloudy.module('image'), jQuery );
}, "lib/namespace": function(exports, require, module) {(function( global ) {
  "use strict";
  global.Cloudy = {
    module: function() {
      // Internal module cache.
      var modules = {};

      // Create a new module reference scaffold or load an
      // existing module.
      return function(name) {
        // If this module has already been created, return it.
        if (modules[name]) {
          return modules[name];
        }

        // Create a module and save it under this name
        return modules[name] = {
          Views: {},
          Controllers: {}
        };
      };
    }()
  };

  Handlebars.registerHelper('url', function( url ){
    return global.s3_bucket_url + '/' + url;
  });

  module.exports = global.Cloudy;
})(this);
}});

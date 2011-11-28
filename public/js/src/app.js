
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
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
}).call(this)({"index": function(exports, require, module) {require('lib/setup');
require('lib/image');
}, "lib/image": function(exports, require, module) {/*jshint onevar: false */
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
}, "lib/setup": function(exports, require, module) {(function( global ) {
  this.Cloudy = {
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

  module.exports = this.Cloudy;
})(this);
}});

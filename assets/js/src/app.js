
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
}).call(this)({"index": function(exports, require, module) {var
  app = require('lib/namespace'),
  image = require('lib/image');


function loadImages( cb ){
  app.images.deferred.done(function(){
    $.when( app.images.dfds ).done(function(){
      var images = $('#images').isotope({ filter: '' });
      $('#loader').fadeOut(800);
      if( $.isFunction( cb ) ) return cb( images );
    });
  });
}

// Defining the application router, you can attach sub routers here.
var Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'gifs': 'gifs'
  },

  index: function() {
    loadImages();
  },

  gifs: function(){
    loadImages(function( images ){
      setTimeout(function(){
        images.isotope({ filter: '.gif' });
      }, 100);
    });
  }

});

app.init = function(){
  this.images = new image.Collection();
  this.router = new Router();

  Backbone.history.start({ pushState: true });
};


jQuery(function($) {
  app.init();

  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // This uses the default router defined above, and not any routers
      // that may be placed in modules.  To have this work globally (at the
      // cost of losing all route events) you can change the following line
      // to: Backbone.history.navigate(href, true);
      app.router.navigate(href, true);
    }
  });

});
}, "lib/image": function(exports, require, module) {/*jshint onevar: false */
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
    }(),

    app: _.extend({}, Backbone.Events)
  };

  Handlebars.registerHelper('url', function( url ){
    return global.s3_bucket_url + '/' + url;
  });

  module.exports = global.Cloudy;
})(this);
}});

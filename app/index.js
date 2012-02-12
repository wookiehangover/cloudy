var
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

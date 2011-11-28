(function( global ) {
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

var stitch = require('stitch');
var path = require('path');

// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask("stitch", "Compile common.js modules with stitch", function( data, name ){

  var done = this.async();

  data.paths = data.paths.map(function(dir){
    return "./" + dir;
  });

  stitch.createPackage( data ).compile(function( error, src ){

    log.writeln('compiling');

    if( error ){
      return log.error( error );
    }

    file.write( name, src );

    log.writeln("File \"" + name + "\" created.");
    done();
  });

});

/*jshint onevar: false */

// Userland Dependencies
var
  util       = require('util'),
  path       = require('path'),
  fs         = require('fs');

// Module Dependencies
var
  strata     = require('strata'),
  handlebars = require('handlebars'),
  Upload     = require('./upload');


// Templates
function getTemplate( filename ) {
  var file = path.resolve( './templates', filename + '.hbs' );
  return fs.readFileSync( file, 'utf8' );
}

var uploadLayout = handlebars.compile( getTemplate( 'upload' ) );

// App & Middleware
var app = new strata.Builder();

var root = path.resolve( './public' );

app.use( strata.commonLogger );
app.use( strata.contentLength );
app.use( strata.contentType );

// Routes
app.get('/', function(env, callback){
  callback( 200, {}, fs.readFileSync('./public/index.html', 'utf8') );
});

app.post("/upload", function (env, callback) {
  var req    = new strata.Request(env);
  var upload = new Upload( env, callback );

  upload.done = function( res, upload ) {
    if ( 200 !== res.statusCode )
      return this.callback( 403, {}, 'something terrible has happened');

    var content = {},
        self    = this;

    ["path", "name", "type", "size"].forEach(function (prop) {
      content[prop] = self.file[prop];
    });

    content.url = upload.url;

    this.callback(200, {}, uploadLayout( content ) );
  };

  req.params(function( err, params ){
    upload.handler( err, params );
  });
});

module.exports = app;

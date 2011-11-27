/*jshint onevar: false */

var
  util       = require('util'),
  path       = require('path'),
  fs         = require('fs');

// Module Dependencies
var
  strata     = require('strata'),
  tmpl       = require('./template'),
  Upload     = require('./upload');


// App & Middleware
var app = new strata.Builder();

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

    this.callback(200, {}, tmpl.upload( content ) );
  };

  req.params(function( err, params ){
    upload.handler( err, params );
  });
});

module.exports = app;

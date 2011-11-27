/*jshint onevar: false */
var
  path       = require('path'),
  fs         = require('fs'),
  strata     = require('strata'),
  s3         = require('./s3');

function Upload( env, callback, name, type ){
  this.env      = env;
  this.callback = callback;
  this.name     = name || "photo";
  this.type     = /image\// || type;
}

Upload.prototype.handler = function( err, params ){
  if (err && strata.handleError(err, this.env, this.callback)) {
    return;
  }

  this.file = params[ this.name ];

  return this.validation() && this.storage();
};

Upload.prototype.validation = function( params ){
  var error = false;

  // Check for param existence
  if( !this.file ) {
    error = 'Param "photo" is required';

  // Check that we have an upload
  } else if( !( this.file instanceof strata.multipart.File ) ) {
    error = 'Param "photo" must be a file upload';

  // Check for file type
  } else if( ! this.type.test( this.file.type ) ) {
    error = 'Param "photo" must be an image';
  }

  // error has been set, return error and return false to stop storage
  if( error ) {
    this.callback( 403, {}, error );
    return false;

  // no error, return true to continue
  } else {
    return true;
  }

};

Upload.prototype.storage = function(){

  var self = this;

  fs.readFile( self.file.path, function( err, buf ){
    if ( err )
      return self.callback( 403, {}, 'something terrible happened whilst reading the file');

    // pass file on to our s3 bucket
    var upload = s3.put( '/test/' + self.file.name, {
      'Content-Length': buf.length,
      'Content-Type': self.file.type
    });

    // render repsonse page on success
    upload.on('response', function( res ) {
      self.done( res, upload );
    });

    upload.end( buf );

  });
};

Upload.prototype.done = function( res, upload ){
  if ( 200 !== res.statusCode )
    return this.callback( 403, {}, 'something terrible has happened');

  var content = {},
      self    = this;

  ["path", "name", "type", "size"].forEach(function (prop) {
    content[prop] = self.file[prop];
  });

  content.url = upload.url;

  this.callback(200, {}, content);
};

module.exports = Upload;

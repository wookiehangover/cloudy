var
  strata = require('strata'),
  tmpl   = require('./template'),
  Bucket = require('./bucket'),
  Upload = require('./upload');

var bucket = new Bucket();

var routes = module.exports = {};

// GET /
routes.index = function( env, callback ) {
  callback( 200, {}, tmpl.index({ url: bucket.client.endpoint }) );
};

// GET /list
routes.list = function( env, callback ) {
  bucket.list(function( data ){
    callback('200', {}, JSON.stringify( data.Contents ) );
  });
};

// POST /upload
routes.upload = function( env, callback ) {
  var
    req    = new strata.Request(env),
    upload = new Upload( env, callback );

  upload.done = function( res, upload ) {
    if ( 200 !== res.statusCode )
      return this.callback( res.statusCode, {}, res.body );

    var
      content = {},
      self    = this;

    ["path", "name", "type", "size"].forEach(function( prop ) {
      content[prop] = self.file[prop];
    });

    content.url = upload.url;

    this.callback(200, {}, tmpl.upload( content ) );
  };

  req.params(function( err, params ) {
    upload.handler( err, params );
  });
};

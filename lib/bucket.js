/*jshint onevar: false */

var
  util       = require('util'),
  path       = require('path'),
  fs         = require('fs');

// Module Dependencies
var
  request    = require('request'),
  xml2js     = require('xml2js'),
  s3         = require('./s3'),
  parser     = new xml2js.Parser();

function Bucket() {
  this.client = s3;
}

Bucket.prototype.list = function( callback ){
  var self = this;

  request( 'http://'+ this.client.endpoint, function( err, resp, body ) {
    if( err || resp.statusCode !== 200 ) throw err;

    parser.parseString( body, function( err, data ) {
      if( err ) throw err;
      callback( data );
    });
  });
};

module.exports = Bucket;

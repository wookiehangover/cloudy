/*jshint onevar: false */
var
  path       = require('path'),
  fs         = require('fs'),
  strata     = require('strata'),
  handlebars = require('handlebars'),
  s3         = require('./s3');

var app = new strata.Builder();

var root = path.resolve( './public' );

app.use( strata.commonLogger );
app.use( strata.contentLength );
app.use( strata.contentType );

app.get('/', function(env, callback){
  callback( 200, {}, fs.readFileSync('./public/index.html', 'utf8') );
});

// POST /
// Uploads a file to the server.
app.post("/upload", function (env, callback) {
  var req = new strata.Request(env);

  req.params(function (err, params) {
    if (err && strata.handleError(err, env, callback)) {
        return;
    }

    var photo = params.photo;

    var error;

    if (!photo) {
      error = 'Param "photo" is required';
    } else if (!(photo instanceof strata.multipart.File)) {
      error = 'Param "photo" must be a file upload';
    } else if (!(/image\//).test(photo.type)) {
      error = 'Param "photo" must be an image';
    }

    // return early if its failed validateion
    if (error)
      return callback( 403, {}, error );

    fs.readFile( photo.path, function(err, buf){

      if ( err )
        callback( 403, {}, 'something terrible happened whilst reading the file');

      var upload = s3.put( '/test/' + photo.name, {
        'Content-Length': buf.length,
        'Content-Type': photo.type
      });

      upload.on('response', function( res ){
        if ( 200 !== res.statusCode )
          return callback( 403, {}, 'something terrible has happened');

        var content = "";

        content += "The photo was uploaded successfully. Here are its properties:";
        content += "<ul>";

        ["path", "name", "type", "size"].forEach(function (prop) {
            content += "<li>" + prop + ": " + photo[prop] + "</li>";
        });

        content += "<li>url: <a href='"+ upload.url +"'>"+ upload.url +"</a></li>";

        content += "</ul>";

        callback(200, {}, content);
      });

      upload.end( buf );
    });

  });
});

module.exports = app;

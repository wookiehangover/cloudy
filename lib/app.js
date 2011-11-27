var
  path       = require('path'),
  fs         = require('fs'),
  strata     = require('strata'),
  handlebars = require('handlebars');

var app = new strata.Builder();

app.use( strata.commonLogger );
app.use( strata.contentLength );
app.use( strata.contentType );

app.get("/", function (env, callback) {
    var content = "";

    content += '<form action="/" method="post" enctype="multipart/form-data">';
    content += '<input name="photo" type="file">';
    content += '<input type="submit" value="Upload">';
    content += '</form>';

    callback(200, {}, content);
});

// POST /
// Uploads a file to the server.
app.post("/", function (env, callback) {
    var req = new strata.Request(env);

    req.params(function (err, params) {
        if (err && strata.handleError(err, env, callback)) {
            return;
        }

        var photo = params.photo;

        // Do some simple validation.
        if (!photo) {
            callback(403, {}, 'Param "photo" is required');
        } else if (!(photo instanceof strata.multipart.File)) {
            callback(403, {}, 'Param "photo" must be a file upload');
        } else if (!(/image\//).test(photo.type)) {
            callback(403, {}, 'Param "photo" must be an image');
        } else {
            var content = "";

            content += "The photo was uploaded successfully. Here are its properties:";
            content += "<ul>";

            ["path", "name", "type", "size"].forEach(function (prop) {
                content += "<li>" + prop + ": " + photo[prop] + "</li>";
            });

            content += "</ul>";

            callback(200, {}, content);
        }
    });
});

module.exports = app;

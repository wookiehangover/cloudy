var strata = require("strata");
var app = new strata.Builder();

app.use( strata.contentType );
app.use( strata.contentLength );

app.run(function (env, callback) {
  callback(200, {}, 'yo');
});

module.exports = app;

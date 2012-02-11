// Module Dependencies
var
  strata = require('strata'),
  routes = require('./lib/routes');

// App & Middleware
var
  app    = new strata.Builder(),
  router = new strata.Router();

app.use( strata.commonLogger );
app.use( strata.contentLength );
app.use( strata.contentType );
app.use( strata.file, 'assets' );

// Routes
router.get( '/', routes.index );

router.get( '/list', routes.list );

router.post( '/upload', routes.upload );

// Initialize App
app.run( router );

strata.run( app, { port: process.env.PORT || 9001 } );

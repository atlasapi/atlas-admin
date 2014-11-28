'use strict';
var config                       = require('./config'),
    common                       = require('./common'),
    express                      = require('express'),
    bodyParser                   = require('body-parser'),
    MongoClient                  = require('mongodb').MongoClient,
    MongoServer                  = require('mongodb').Server,
    app                          = express();

var _http_port = config.port.http;
var _mongo_port = config.port.mongo;

// middleware: parse incoming request data as json
app.use( bodyParser.json() );

// middleware: set content-type headers, and prep response
app.use( require('./lib/middleware/prepResponse') );

// middleware: check calls against whitelisted domains
app.use( require('./lib/middleware/crossOrigin') );

// middleware: proxy atlas requests
app.use( require('./lib/middleware/auth') );

// middleware: debug option (add ?debug to the url for log output)
app.use( require('./lib/middleware/debug') );

// open up a connection to mongodb, then register endpoints and boot the server
MongoClient.connect(config.database, function(err, db) {
    if (err) { console.error(err); }

    // create mongo connection and drop into common
    common.db = db;

    // register REST endpoints
    app.use(config.paths.apiRoot + '/requests',     require('./lib/gateways/requests')(db));
    app.use(config.paths.apiRoot + '/propositions', require('./lib/gateways/propositions')(db));
    app.use(config.paths.apiRoot + '/wishes',       require('./lib/gateways/wishes')(db));
    app.use(config.paths.apiRoot + '/usage',        require('./lib/gateways/usage')(db));
    app.use(config.paths.apiRoot + '/user',         require('./lib/gateways/user')(db));
    app.use(config.paths.apiRoot + '/feeds',        require('./lib/gateways/feeds')(db));

    // listen for requests to server on _http_port
    console.log('listen on port: ' + _http_port);
    app.listen(_http_port);
});

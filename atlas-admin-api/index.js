'use strict';

var config                       = require('./config'),
    common                       = require('./common'),
    express                      = require('express'),
    bodyParser                   = require('body-parser'),
    MongoClient                  = require('mongodb').MongoClient,
    MongoServer                  = require('mongodb').Server,
    app                          = express(),
    auth                         = require('./lib/middleware/auth'),
    prepResponse                 = require('./lib/middleware/prepResponse'),
    gatewayRequest               = require('./lib/gateways/requests'),
    gatewayWishlist              = require('./lib/gateways/wishlist');

var _http_port = config.port.http;
var _mongo_port = config.port.mongo;

// middleware: parse incoming request data as json
app.use(bodyParser.json());

// middleware: set content-type headers, and prep response
app.use(prepResponse);

// middleware: check calls against whitelisted domains
app.use(function allowCrossDomain(req, res, next) {
    var origin = req.headers.origin;
    if (config.allowedDomains.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }else{
        res.header('401'); 
    }
    next();
});

// middleware: proxy atlas requests
app.use(auth);

// open up a connection to mongodb, then register endpoints and boot the server
var mongoclient = new MongoClient(
    new MongoServer(config.database.host, _mongo_port), {native_parser: true});

mongoclient.open(function(err, mongo) {
    if (err) console.error(err); 
    var db = mongo.db(config.database.name);

    // register REST endpoints
    app.use(config.paths.apiRoot + '/requests', gatewayRequest(db));
    app.use(config.paths.apiRoot + '/wishlist', gatewayWishlist(db));

    // listen for requests to server on _http_port
    console.log('listen on port: ' + _http_port);
    app.listen(_http_port);
})

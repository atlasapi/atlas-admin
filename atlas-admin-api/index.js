'use strict';
var config                       = require('./config'),
    common                       = require('./common'),
    express                      = require('express'),
    bodyParser                   = require('body-parser'),
    MongoClient                  = require('mongodb').MongoClient,
    MongoServer                  = require('mongodb').Server,
    app                          = express(),
    gatewayRequests              = require('./lib/gateways/requests'),
    gatewayPropositions          = require('./lib/gateways/propositions'),
    gatewayUsage                 = require('./lib/gateways/usage'),
    gatewayFeeds                 = require('./lib/gateways/feeds'),
    gatewayWishes                = require('./lib/gateways/wishes');

var _http_port = config.port.http;
var _mongo_port = config.port.mongo;

// middleware: parse incoming request data as json
app.use( bodyParser.json() );

// middleware: set content-type headers, and prep response
app.use( require('./lib/middleware/prepResponse') );

// middleware: check calls against whitelisted domains
app.use( require('./lib/middleware/allowAccess') );

// middleware: proxy atlas requests
app.use( require('./lib/middleware/auth') );

// middleware: user grouping
app.use( require('./lib/middleware/userGroups').middleware );

// open up a connection to mongodb, then register endpoints and boot the server
var mongoclient = new MongoClient(
    new MongoServer(config.database.host, _mongo_port), {native_parser: true});

mongoclient.open(function(err, mongo) {
    if (err) console.error(err); 
    var db = mongo.db(config.database.name);
    common.db = db;

    // register gateway REST endpoints
    app.use(config.paths.apiRoot + '/requests',     gatewayRequests(db));
    app.use(config.paths.apiRoot + '/propositions', gatewayPropositions(db));
    app.use(config.paths.apiRoot + '/wishes',       gatewayWishes(db));
    app.use(config.paths.apiRoot + '/usage',        gatewayUsage(db));
    app.use(config.paths.apiRoot + '/feeds',        gatewayFeeds(db));

    // return group info for current user
    app.use(config.paths.apiRoot + '/groups', require('./lib/middleware/userGroups').query(db));

    // listen for requests to server on _http_port
    console.log('listen on port: ' + _http_port);
    app.listen(_http_port);
})

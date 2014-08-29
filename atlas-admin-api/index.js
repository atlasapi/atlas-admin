var config                       = require('./lib/config'),
    express                      = require('express'),
    bodyParser                   = require('body-parser'),
    MongoClient                  = require('mongodb').MongoClient,
    MongoServer                  = require('mongodb').Server,
    app                          = express(),
    gatewaySourceRequest         = require('./lib/gateways/sourceRequest');

var port = process.env.PORT || 9000;

app.use(bodyParser.json());

// middleware to check calls against whitelisted domains
app.use(function allowCrossDomain(req, res, next) {
    var originPermissionCheck = function(req) {
        var origin = req.headers.origin;
        if (config.allowedDomains.indexOf(origin) >= 0) return origin;
    }
    res.header('Access-Control-Allow-Origin', originPermissionCheck(req));
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// open up a persistant connection to the database
var mongoclient = new MongoClient(
    new MongoServer(config.database.host, 27017), {native_parser: true});

mongoclient.open(function(err, mongo) {
    if (err) console.error(err); 
    var db = mongo.db(config.database.name);

    // configure REST interface
    app.use(config.paths.apiRoot + '/sourceRequest', gatewaySourceRequest(db));

    // listen for requests to server on port
    console.log('listen on port: ' + port);
    app.listen(port);
})



var config                       = require('./config'),
    express                      = require('express'),
    bodyParser                   = require('body-parser'),
    MongoClient                  = require('mongodb').MongoClient,
    MongoServer                  = require('mongodb').Server,
    app                          = express(),
    gatewaySourceRequest         = require('./lib/gateways/sourceRequest'),
    oAuthProxy                   = require('./lib/oAuthProxy');

var port = process.env.PORT || 9000;

// middleware: parse incoming request data as json
app.use(bodyParser.json());

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
app.use(oAuthProxy);

// open up a persistant connection to the database
var mongoclient = new MongoClient(
    new MongoServer(config.database.host, 27017), {native_parser: true});

mongoclient.open(function(err, mongo) {
    if (err) console.error(err); 
    var db = mongo.db(config.database.name);

    // register REST endpoints
    app.use(config.paths.apiRoot + '/requests', gatewaySourceRequest(db));

    // listen for requests to server on port
    console.log('listen on port: ' + port);
    app.listen(port);
})



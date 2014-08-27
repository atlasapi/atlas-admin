var config                       = require('./lib/config'),
    express                      = require('express'),
    MongoClient                  = require('mongodb').MongoClient,
    app                          = express(),
    gatewaySourceRequest         = require('./lib/gateways/sourceRequest');

var port = process.env.PORT || 9000;

// start up the mongodb connection, then continue with configuring the app
MongoClient.connect('mongodb://' + config.database.host + ':27017/' + config.database.collection, function(err, db) {
    if (err) console.error(err); 

    // configure endpoints
    app.use(config.paths.apiRoot+'/sourceRequest', gatewaySourceRequest(db));

    // listen for requests on port
    console.log('listen on port: '+port);
    app.listen(port);

    db.close();
})
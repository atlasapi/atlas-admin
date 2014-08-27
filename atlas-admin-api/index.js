var config                       = require('./lib/config.js'),
    express                      = require('express'),
    MongoClient                  = require('mongodb').MongoClient,
    gatewaySourceRequest         = require('./lib/gateways/sourceRequest.js'),
    app                          = express();

var port = 8000;

// mongodb configuration
MongoClient.connect('mongodb://'+config.dbHost+':27017/atlasadmin', function(err, db) {
    if (err) console.error(err); 

    // configure source request endpoints
    gatewaySourceRequest( app, db );

    // close the database connection
    db.close();
})
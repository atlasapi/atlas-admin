var config                       = require('./lib/config.js'),
    express                      = require('express'),
    MongoClient                  = require('mongodb').MongoClient,
    app                          = express();
    gatewaySourceRequest         = require('./lib/gateways/sourceRequest.js');

var port = 9000;

// mongodb configuration
MongoClient.connect('mongodb://'+config.dbHost+':27017/atlasadmin', function(err, db) {
    if (err) console.error(err); 

    // configure source request endpoints
    gatewaySourceRequest( app, db );

    // listen on port
    console.log('listen on port: '+port);
    app.listen(port);

    // close the database connection
    db.close();
})
var config          = require('./lib/config.js'),
    express         = require('express'),
    MongoClient     = require('mongodb').MongoClient,
    gateway         = require('./lib/gateway'),
    app             = express();

var port = 8000;

// mongodb configuration
MongoClient.connect('mongodb://'+config.dbHost+':27017/atlasadmin', function(err, db) {
    if (err) console.error(err); 

    // configure source request endpoints
    
    db.close();
})

// configure express
// static files
app.use(express.static(__dirname + '/app'));

// for the default route, simply send the index.html
// file back to the browser
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
})

// listen on port for requests...
console.log('listening on port: '+port);
app.listen(8000);
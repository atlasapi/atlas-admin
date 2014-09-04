var config      = require('../../config'),
    common      = require('../../common'),
    qs          = require('querystring'),
    express     = require('express'),
    http        = require('http'),
    ObjectID    = require('mongodb').ObjectID;

var sendSourceToAtlas = function(appId, sourceId, enable) {
    if ( !common.oauth.provider || !common.oauth.token ) return false;

    var enableSource = function(src) {
    }

    var responder = {
        success: function() {
            console.log('done');
        },
        fail: function() {
            console.error('not done');
        }
    }
   
    var postData = qs.stringify({
        appId: appId,
        appUrl: '',
        reason: '',
        usageType: 'personal',
        licenseAccepted: true,
        oauth_provider: common.oauth.provider,
        oauth_token: common.oauth.token
    })

    var opts = {
        host: config.atlasHost,
        port: 80,
        path: '/4/sources/'+sourceId+'/requests?'+postData,
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    }

    var request = http.request(opts, function(response) {
        response.setEncoding('utf8');
        var data = '',
            status = response.statusCode;
        response.on('data', function(chunk) {
            data += chunk;
        })
        .on('end', function() { 
            if (status === 200) {
               responder.success(response);
            }else{
                responder.fail(response);
            }
        });
    });
    //request.write(postData);
    request.end();
}

// create REST interface for source requests feature
// @param db {object} the mongo database object
var sourceRequest = function(db) {
    'use strict'
    var router      = express.Router(),
        collection  = db.collection('sourceRequests');

    router.route('/')
        .post(function(req, res) {
            sendSourceToAtlas(req.body.app.id, req.body.source.id, false)
            collection.insert(req.body, function(err, data) {
                if (err) throw err;
                res.end();
            })
        })
        .get(function(req, res) {
            collection.find({state: 'not approved'}, {}).toArray(function(err, data) {
                if (err) throw err;
                res.end(JSON.stringify(data));
            });
        })
        .put(function(req, res) {
            var id = req.body.request_id,
                new_state = req.body.new_state;
            collection.update( {_id: new ObjectID(id)}, {$set: {state: new_state}}, function(err, count, status) {
                if (err) throw err;
                res.end(JSON.stringify(status));
            });
        })
    return router;
}

module.exports = sourceRequest;
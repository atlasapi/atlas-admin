'use strict';
var config      = require('../../config'),
    Atlas       = require('../services/atlasProvider'),
    qs          = require('querystring'),
    express     = require('express'),
    http        = require('http'),
    ObjectID    = require('mongodb').ObjectID,
    _           = require('lodash');

var sendSourceToAtlas = function(appId, sourceId, enable) {
    if (typeof appId !== 'string' || typeof sourceId !== 'string') {
        console.error('appId and sourceId not present');
        return false;
    }
   
    var postData = qs.stringify({
        appId: appId,
        appUrl: '',
        reason: '',
        usageType: 'personal',
        licenseAccepted: true
    })

    Atlas.request('/sources/'+sourceId+'/requests?'+postData, 'POST');
}


// create REST interface for source requests feature
// @param db {object} the mongo database object
var sourceRequest = function(db) {
    var router      = express.Router(),
        collection  = db.collection('sourceRequests');

    router.route('/')
        .post(function(req, res) {
            if (!'app' in req.body ||!'source' in req.body) return false;
            sendSourceToAtlas(req.body.app.id, req.body.source.id, false);
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
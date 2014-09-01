var express     = require('express'),
    ObjectID    = require('mongodb').ObjectID;

// create REST interface for source requests feature
// @param db {object} the mongo database object
var sourceRequest = function(db) {
    'use strict'
    var router      = express.Router(),
        collection  = db.collection('sourceRequests');

    router.route('/')
        .post(function(req, res) {
            collection.insert(req.body, function(err, data) {
                if (err) throw err;
                res.end();
            })
        })
        .get(function(req, res) {
            console.log(req);
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
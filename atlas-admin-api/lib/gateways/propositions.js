'use strict';

var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    validate    = require('../services/validationHelpers'),
    http        = require('http'),
    ObjectID    = require('mongodb').ObjectID;

// REST interface for wishlist
//
// @param db {object} the mongo database object
var wishlistInterface = function(db) { 
    var router  = express.Router(),
        wishlistCollection = db.collection('wishlist');

    router.route('/')
        .get( function(req, res) {
            wishlistCollection.find({}, {}).toArray(function(err, data) {
                if (err) throw err;
                var output = JSON.stringify(data) || JSON.stringify(common.errors.no_data);
                res.end(output);
            })
        })
        .post( function(req, res) {
            var payload = req.body;
            // bounce back with error if payload is empty
            if (!Object.getOwnPropertyNames(payload).length) {
                res.statusCode = 400;
                res.end( JSON.stringify(common.errors.no_post_data) )
                return;
            }
            // validate request data against a schema descriptor
            var schema = new validate.schema({
                type: {type: 'string', required: true},
                title: {type: 'string', required: true},
                status: {type: 'string', required: true},
                feature: {type: 'object'}
            }, payload);

            if (schema.invalid) {
                res.statusCode = 400;
                res.end( JSON.stringify(common.errors.invalid_data) ) 
                return;
            }

            // push the request into the database
            wishlistCollection.insert(payload, {w: 1}, function(err, records) {
                if (err) {
                    res.statusCode = 500;
                    res.end( JSON.stringify(common.errors.request_error) )
                }else{
                    res.statusCode = 201;
                    res.end(JSON.stringify(records[0]));                    
                }
            });
        })



    router.route('/:itemId')
        .delete(function(req, res) {
            var user = common.user;
            if (user.role === 'admin' && typeof req.params.itemId === 'string') {
                var id = new ObjectID(req.params.itemId);
                wishlistCollection.remove({"_id": id}, {w:1}, function(err, numRemoved) {
                    res.statusCode = 200;
                    res.end('{"deleted": "'+numRemoved+'"}');
                })
            }
        })
        .get(function(req, res) {
            if (typeof req.params.itemId === 'string' && req.params.itemId.length == 25) {
                var id = new ObjectID(req.params.itemId);
                wishlistCollection.find({"_id": id}, {}).toArray(function(err, data) {
                    if (err) throw err;
                    var output = JSON.stringify(data) || JSON.stringify(common.errors.no_data);
                    res.end(output);
                })
            }
        })



    router.route('/:itemId/status')
        .post(function(req, res) {
            var payload = req.body;
            var user = common.user;
            if (user.role === 'admin' 
                && typeof req.params.itemId === 'string' 
                && payload.status) {
                var status = payload.status.toString();
                var id = new ObjectID(req.params.itemId);
                wishlistCollection.update({"_id": id}, {$set: {"status": status}}, {}, function(err, updateCount) {
                    res.statusCode = 200;
                    res.end('{"updated": "'+updateCount+'"}');
                })
            }
        })

    return router;
}

module.exports = wishlistInterface;
'use strict';

var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    model       = require('../services/modelHelpers'),
    http        = require('http'),
    ObjectID    = require('mongodb').ObjectID;

// REST interface for wishlist
//
// @param db {object} the mongo database object
var wishlist = function(db) { 
    var router  = express.Router(),
        wishlistCollection = db.collection('wishlist'),
        wishesCollection = db.collection('wishlistRequests');

    router.route('/user')

        // GET: returns all requests for current user
        .get( function(req, res) {
            if ('string' !== typeof common.user.id) {
                res.statusCode = 403;
                res.end( JSON.stringify(common.errors.not_permitted) )
                return;
            }
            var userId = common.user.id;
            wishesCollection.find({'user.id': userId}, {}).toArray(function(err, data) {
                if (err) throw err;
                var output = JSON.stringify(data) || JSON.stringify(common.errors.no_data);
                res.end(output);
            })
        })

    router.route('/')

        // GET: returns all wishlist items
        .get( function(req, res) {
            wishlistCollection.find({}, {}).toArray(function(err, data) {
                if (err) throw err;
                var output = JSON.stringify(data) || JSON.stringify(common.errors.no_data);
                res.end(output);
            })
        });

    router.route('/create')

        // POST: create a new wish
        .post( function(req, res) {
            var payload = req.body;
            // bounce back with error if payload is empty
            if (!Object.getOwnPropertyNames(payload).length) {
                res.statusCode = 400;
                res.end( JSON.stringify(common.errors.no_post_data) )
                return;
            }

            payload.user = common.user;

            // validate wish data
            var schema = {
                user: {type: 'object', required: true},
                wish: {type: 'object', required: true},
                reason: {type: 'string', required: true}
            }
            var valid = new model.Validator(schema, payload);
            if (valid.fail) {
                res.statusCode = 400;
                res.end( JSON.stringify(common.errors.invalid_data) ) 
                return;
            }

            // push the request into the database
            wishesCollection.insert(payload, {w: 1}, function(err, records) {
                if (err) {
                    res.statusCode = 500;
                    res.end( JSON.stringify(common.errors.request_error) )
                }else{
                    res.statusCode = 201;
                    res.end(JSON.stringify(records[0]));                    
                }
            });
        });

    router.route('/new-item')

        .post( function(req, res) {
            var payload = req.body;
            // bounce back with error if payload is empty
            if (!Object.getOwnPropertyNames(payload).length) {
                res.statusCode = 400;
                res.end( JSON.stringify(common.errors.no_post_data) )
                return;
            }
            // validate request data against a schema descriptor
            var schema = {
                type: {type: 'string', required: true},
                title: {type: 'string', required: true},
                status: {type: 'string', required: true},
                feature: {type: 'object'}
            }
            var valid = new model.Validator(schema, payload);
            if (valid.fail) {
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

    return router;
}

module.exports = wishlist;
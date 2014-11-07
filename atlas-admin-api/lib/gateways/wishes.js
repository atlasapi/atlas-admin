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
        wishesCollection = db.collection('wishlistRequests');

    router.route('/')

        .get( function(req, res) {
            var user = common.user;
            if (user.role === 'admin') {
                wishesCollection.find({}, {}).toArray(function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    var output = JSON.stringify(data) || JSON.stringify(common.errors.no_data);
                    res.end(output);
                })
            }else{
                res.statusCode = 403;
                res.end(JSON.stringify(common.errors.not_permitted));
            }
        })

        .post( function(req, res) {
            // bounce back with error if payload is empty
            if (!Object.getOwnPropertyNames(req.body).length) {
                res.statusCode = 400;
                res.end( JSON.stringify(common.errors.no_post_data) )
                return;
            }
            var payload = req.body;
            payload.user = common.user;
            // validate wish data against descriptor
            var schema = new validate.schema({
                user: {type: 'object', required: true},
                wish: {type: 'object', required: true},
                reason: {type: 'string', required: true}
            }, payload);
            if (schema.invalid) {
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


    router.route('/user/:userId')
        .get( function(req, res) {
            var userId = req.params.userId;
            if ('string' !== typeof userId) {
                res.statusCode = 403;
                res.end( JSON.stringify(common.errors.not_permitted) )
                return;
            }
            if (userId === 'current') userId = common.user.id;
            wishesCollection.find({'user.id': userId}, {}).toArray(function(err, data) {
                if (err) {
                    console.error(err);
                }
                var output = JSON.stringify(data) || JSON.stringify(common.errors.no_data);
                res.end(output);
            })
        })

    return router;
}

module.exports = wishlistInterface;
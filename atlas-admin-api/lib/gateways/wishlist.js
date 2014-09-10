'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    http        = require('http'),
    ObjectID    = require('mongodb').ObjectID;

// create REST interface for source requests feature
//
// @param db {object} the mongo database object
var wishlist = function(db) { 
    var router = express.Router(),
        wishlistCollection = db.collection('wishlist');

    var user = common.user;

    router.route('/')
        .get( function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            wishlistCollection.find({type: 'source'}, {}).toArray(function(err, data) {
                if (err) throw err;
                var output = JSON.stringify(data) || common.responses.no_data;
                res.end(output);
            })
        });

    router.route('/create')
        .post( function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            var body = req.body || null;
            wishlistCollection.insert( function() {

            });
        });
    return router;
}

module.exports = wishlist;
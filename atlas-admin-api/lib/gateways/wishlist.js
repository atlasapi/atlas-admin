'use strict';
var config      = require('../../config'),
    express     = require('express'),
    http        = require('http'),
    ObjectID    = require('mongodb').ObjectID;

// create REST interface for source requests feature
//
// @param db {object} the mongo database object
var wishlist = function(db) { 
    var router = express.Router(),
        wishlistCollection = db.collection('wishlist');
        wishlistCollection = db.collection('wishlist');

    router.route('/')
        .get( function(req, res) {
            res.end('hello');
        });

    return router;
}

module.exports = wishlist;
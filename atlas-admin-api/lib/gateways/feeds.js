'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    ObjectID    = require('mongodb').ObjectID;

// REST interface for feeds
//
// @param db {object} the mongo database object
var feedsInterface = function(db) {
    var router  = express.Router();

    router.route('/')
        .get( function(req, res) {
            var _feeds = [{
                name: "BBC to YouView",
                location: "/feeds/youview",
                endpoint: "/3.0/feeds/youview"
            }];
            res.end(JSON.stringify(_feeds));
        });

    return router;
}

module.exports = feedsInterface;
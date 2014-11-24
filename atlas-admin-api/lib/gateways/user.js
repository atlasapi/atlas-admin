'use strict';

var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    _           = require('lodash'),
    ObjectID    = require('mongodb').ObjectID;

//  REST interface for user endpoint
//
//  @param db {object} the mongo database object
//
var userInterface = function(db) {
    var User    = require('../services/userProvider'),
        router  = express.Router();

    router.route('/groups')

            .get(function(req, res) {
                User.groups().then(function(groups) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(groups)); 
                }, function(reason) {
                    res.statusCode = 400;
                    res.end(JSON.stringify(reason));
                });
            })

            .post(function(req, res) {
                var body = req.body || null;
                res.end()
            });

    return router;
}

module.exports = userInterface;
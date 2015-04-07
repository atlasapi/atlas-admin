'use strict';

var express = require('express');

//  REST interface for user endpoint
//
var userInterface = function() {
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
    });

    // .post(function(req, res) {
    //     var body = req.body || null;
    //     res.end();
    // });

    return router;
};

module.exports = userInterface;

'use strict'
var config = require('../config'),
    express = require('express');

// create REST interface for source requests
var sourceRequest = function(db) {
    var router = express.Router();
    router.route('/')
        .post(function(req, res) {
            db.collection('sourceRequests').insert(req.body, {w:1}, function(err, data) {
                console.log(err);
            })
        })
    return router;
}

module.exports = sourceRequest;
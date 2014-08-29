'use strict'
var config = require('../config'),
    express = require('express');

// create REST interface for source requests
var sourceRequest = function(db) {
    var router = express.Router();
    router.route('/')
        .post(function(req, res) {
            db.collection('sourceRequests').insert(req.body, function(err, data) {
                if (err) throw err;
                res.end(data)
            })
        })
    return router;
}

module.exports = sourceRequest;
'use strict'

var config = require('../config'),
    express = require('express');

var sourceRequest = function(db) {
    var router = express.Router();

    router.route('/')
        .post(function(req, res) {
            console.log('post');
        })
        .get(function() {
            console.log('get')
        });

    return router;
}

module.exports = sourceRequest;
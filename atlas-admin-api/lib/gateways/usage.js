'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    Logstash    = require('../services/logstashProvider'),
    qs          = require('querystring'),
    express     = require('express'),
    _           = require('lodash'),
    ObjectID    = require('mongodb').ObjectID;

function Usage() {
    var router = express.Router()

    // used for requesting usage data about a api key over a certain time period
    router.route('/:apiKey/:timePeriod')
        .get(function(req, res) {
            var key = req.param('apiKey'),
                time_period = req.param('timePeriod');

            switch (time_period) {
                case 'hour':
                    Logstash.search.past_hour(key).then(function(data) {
                        res.end(data);
                    });
                    break;
                case 'day':
                    Logstash.search.past_day(key).then(function(data) {
                        res.end(data);
                    });
                case 'week':
                    Logstash.search.past_week(key).then(function(data) {
                        res.end(data);
                    });

                case 'month':
                    Logstash.search.past_month(key).then(function(data) {
                        res.end(data);
                    });
                    break;
            }
        })

    return router;
}

module.exports = Usage;
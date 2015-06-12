'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    Logstash    = require('../services/logstashProvider'),
    express     = require('express'),
    _           = require('lodash'),
    ObjectID    = require('mongodb').ObjectID;

function Usage() {
    var router = express.Router();

    console.log('Usage');

    // used for requesting usage data about a api key over a certain time period
    router.route('/:apiKey/:timePeriod')
        .get(function(req, res) {
            console.log('per app usage route');
            var isAdmin = (common.user.role === 'admin')? true : false;
            if (!isAdmin) {
                res.end(JSON.stringify(common.errors.not_permitted));
                return;
            }
            var key = req.params.apiKey,
                time_period = req.params.timePeriod;

            switch (time_period) {
                case 'hour':
                    Logstash.search.past_hour(key).then(function(data) {
                        res.end(data);
                    }, function(err) {
                        res.end(err);
                        console.log(err.stack);
                    });
                    break;
                case 'day':
                    Logstash.search.past_day(key).then(function(data) {
                        res.end(data);
                    }, function(err) {
                        res.end(err);
                        console.log(err.stack);
                    });
                    break;
                case 'week':
                    Logstash.search.past_week(key).then(function(data) {
                        res.end(data);
                    }, function(err) {
                        res.end(err);
                        console.log(err.stack);
                    });
                    break;
                case 'month':
                    Logstash.search.past_month(key).then(function(data) {
                        res.end(data);
                    }, function(err) {
                        res.end(err);
                        console.log(err.stack);
                    });
                    break;
            }
        });

    return router;
}

module.exports = Usage;

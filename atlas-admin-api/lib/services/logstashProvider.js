'use strict';
var common = require('../../common'),
    config = require('../../config'),
    Q      = require('q'),
    http   = require('http'),
    _      = require('lodash');


function Logstash() {
    var _logstash_host = 'node1.logstash.mbst.tv';


    //  For converting a date into a timestamp
    //  
    //  @param dateObj {date} the date to be converted
    //  @returns {string}
    function toTimestamp(dateObj){
        return Math.floor(dateObj.getTime());
    }


    //  For creating a new query object to be sent to elasticsearch
    //
    //  @param options {object} optional options obj to extend 
    //         defaults (see _defaults for details)
    //  @returns {object}
    //
    function new_elasticsearch_query(options) {
        var _query, _defaults
            options = options || {};

        _defaults = _.assign({
            interval: '1m',
            timestamp: {
                from: null,
                to: null
            },
            query: '*'
        }, options);

        var _query = {
            "facets": {
                "0": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": _defaults.interval
                    },
                    "global": true,
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "query_string": {
                                            "query": _defaults.query
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                            {
                                                "range": {
                                                    "@timestamp": {
                                                        "from": _defaults.timestamp.from,
                                                        "to": _defaults.timestamp.to
                                                    }
                                                }
                                            }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "size": 0,
        };
        return _query;
    }


    //  For making a request to elasticsearch 
    //
    //  @param startDate {date}
    //  @param endDate {date}
    //  @param apiKey {string}
    //  @param timeInterval {string} '1m' '1h' etc
    //  @returns promise
    //
    function query_elasticsearch(startDate, endDate, apiKey, timeInterval) {
        var defer = Q.defer();
        var timeInterval = timeInterval || '1m';
        if (!_.isString(apiKey) || !_.isDate(startDate) || !_.isDate(endDate)) {
            console.error('query_elasticsearch() - invalid arg type');
            defer.reject();
            return defer.promise;
        }

        var _query = new_elasticsearch_query({
            interval: timeInterval,
            query: 'apiKey:'+apiKey,
            timestamp: {
                from: toTimestamp(startDate),
                to: toTimestamp(endDate)
            }
        });

        var _opts = {
            hostname: _logstash_host,
            port: 9200,
            path: '/_search',
            method: 'XGET'
        }

        var req = http.request(_opts, function(response) {
            response.setEncoding('utf8');
            var _data = '';
            response.on('data', function(chunk) {
                _data += chunk;
            });
            response.on('end', function() {
                defer.resolve(_data);
            });
            response.on('error', function(err) {
                console.log('ES response error');
                console.log(err);
            })
        });

        req.on('error', function(err) {
            console.error('Problem with ES request');
            console.log(err);
        })

        // send the query data along with the request
        req.write(JSON.stringify(_query));      
        req.end();
        return defer.promise;
    }


    //  For getting data about a key for the last hour 
    //
    //  @param key {string} the api key to search on
    //  @returns promise
    //
    function search_on_past_hour(key) {
        var defer = Q.defer();
        if (!_.isString(key)) {
            console.error('search_on_past_hour() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setHours(_end.getHours() - 1));
        console.log('hour: '+_start);
        query_elasticsearch(_start, _end, key).then(defer.resolve);
        return defer.promise;
    }


    //  For getting data about a key for the last 24hrs 
    //
    //  @param key {string} the api key to search on
    //  @returns promise
    //
    function search_on_past_day(key) {
        var defer = Q.defer();
        if (!_.isString(key)) {
            console.error('search_on_past_day() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setHours(_end.getHours() - 24));
        console.log('day: '+_start);
        query_elasticsearch(_start, _end, key).then(defer.resolve);
        return defer.promise;
    }


    //  For getting data about a key for the last week 
    //
    //  @param key {string} the api key to search on
    //  @returns promise
    //
    function search_on_past_week(key) {
        var defer = Q.defer();
        if (!_.isString(key)) {
            console.error('search_on_past_week() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setDate(_end.getDate()-7));
        console.log('week: '+_start);
        query_elasticsearch(_start, _end, key).then(defer.resolve);
        return defer.promise;
    }


    //  For getting data about a key for the last month 
    //
    //  @param key {string} the api key to search on
    //  @returns promise
    //
    function search_on_past_month(key) {
        var defer = Q.defer();
        if (!_.isString(key)) {
            console.error('search_on_past_month() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setDate(_end.getDate()-30));
        console.log('month: '+_start);
        query_elasticsearch(_start, _end, key).then(defer.resolve);
        return defer.promise;
    }

    return {
        search: {
            past_hour: search_on_past_hour,
            past_day: search_on_past_day,
            past_week: search_on_past_week,
            past_month: search_on_past_month
        }
    }
}

module.exports = Logstash();
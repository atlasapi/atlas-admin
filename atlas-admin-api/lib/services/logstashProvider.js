'use strict';
var common = require('../../common'),
    config = require('../../config'),
    Q      = require('q'),
    http   = require('http'),
    _      = require('lodash');


function Logstash() {
    var _logstash_host = 'node1.logstash.mbst.tv';


    //  For converting a date into a unix timestamp
    //  
    //  @param dateObj {date} the date to be converted
    //  @returns {string}
    function toTimestamp(dateObj){
        return Math.floor(dateObj.getTime()/1000);
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

        _defaults = _.assign(options, {
            interval: '1m',
            timestamp: {
                from: null,
                to: null
            },
            query: '*'
        });

        _query = {
            "aggs" : {
                "articles_over_time": {
                    "date_histogram": {
                        "field": "@timestamp",
                        "interval": _defaults.interval,
                    }
                },
                "date_range": {
                    "field": "@timestamp",
                    "ranges": [{"from": _defaults.timestamp.from , "to": _defaults.timestamp.to}]
                }
            }

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
                                            "query": "*"
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [{
                                                "range": {
                                                    "@timestamp": {
                                                        "from": _defaults.timestamp.from,
                                                        "to": _defaults.timestamp.to
                                                    }
                                                }
                                            },
                                            {
                                                "fquery": {
                                                    "query": {
                                                        "query_string": {
                                                            "query": _defaults.query
                                                        }
                                                    }
                                                }
                                            }]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "size": 0,
            "sort": [
            {
                "@timestamp": {
                    "order": "desc",
                    "ignore_unmapped": true
                }
            },
            {
                "@timestamp": {
                    "order": "desc",
                    "ignore_unmapped": true
                }
            }
            ]
        };
        return _query;
    }


    //  For making a request to elasticsearch 
    //
    //  @param key {string} the api key to search on
    //  @returns promise
    //
    function query_elasticsearch(startDate, endDate, apiKey, timeInterval) {
        var defer = Q.defer();
        var timeInterval = timeInterval || '1m';
        if (!_.isString(apiKey) || !_.isDate(startDate) || !_.isDate(endDate)) {
            console.error('query_elasticsearch() - invalid ark type');
            defer.reject();
            return defer.promise;
        }

        // set the start and end params to be now and one day ago
        // so we can use them in our search query
        var _request = new_elasticsearch_query({
            interval: timeInterval,
            query: 'apiKey: '+apiKey,
            timestamp: {
                from: toTimestamp(startDate),
                to: toTimestamp(endDate)
            }
        });

        // construct the dates of the logs we want to search in
        var logstash_start_date = startDate.getFullYear()+'.'+(startDate.getMonth()+1)+'.'+startDate.getDate(),
            logstash_end_date = endDate.getFullYear()+'.'+(endDate.getMonth()+1)+'.'+endDate.getDate();

        var _opts = {
            hostname: _logstash_host,
            port: 9200,
            path: '/_search?',
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
        });

        // send the query data along with the request
        req.write(JSON.stringify(_request));      
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
            console.error('day() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        // TODO: set the date 
        var _end = new Date();
        var _start = new Date(new Date().setDate(_end.getDate()-1));
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
            console.error('day() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setDate(_end.getDate()-1));
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
            console.error('day() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setDate(_end.getDate()-7));
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
            console.error('day() - key arg must be a string');
            defer.reject();
            return defer.promise;
        }
        var _end = new Date();
        var _start = new Date(new Date().setDate(_end.getDate()-7));
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
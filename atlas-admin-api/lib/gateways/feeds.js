'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    http        = require('http'),
    Q           = require('q'),
    qs          = require('querystring'),
    _           = require('lodash'),
    Feeds       = require('../services/feedsProvider'),
    Atlas       = require('../services/atlasProvider'),
    _feeds      = [];


//  Used for determining if a string is valid JSON or not
//
//  @returns {bool}
//
function IsJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//  Used for proxying requests to atlas and returning the result
//
//  @returns promise
//
function proxyRequest(endpoint, request) {
    var defer           = Q.defer(),
        _endpoint       = endpoint,
        _annotations    = request.query.annotations || null,
        _querystring    = { apiKey: null };

    for (var feed in _feeds) {
        if (_feeds[feed].name == 'BBC to YouView') {
            _querystring.apiKey = _feeds[feed].apiKey;
        }
    }

    for (var query in request.query) {
        if ('status' === query 
            || 'uri' === query 
            || 'transaction_id' === query
            || 'limit' === query
            || 'offset' === query
            || 'annotations' === query) {
            _querystring[query] = request.query[query];
        }
    }

    Atlas.api('/3.0/feeds/youview/bbc_nitro/'+_endpoint+'?'+qs.stringify(_querystring), 'GET', function(status, data) {
        if (IsJSON(data)) {
            defer.resolve(JSON.parse(data));
        }else{
            console.error('Response is invalid')
            defer.reject(common.errors.invalid_json);
        }
    });
    return defer.promise;
}

function getXML(uri) {
    var defer = Q.defer(),
        _uri = uri || null,
        query = qs.stringify({apiKey: _apikey, uri: _uri});
    if (_uri) {
        Atlas.api('/3.0/feeds/youview/bbc_nitro.xml?'+query, 'GET', function(status, data) {
            defer.resolve(data);
        });
    }
    return defer.promise;
}

function loadFeeds(req, res, next) {
    Feeds.getAll().then(function(feeds) {
        _feeds = feeds;
        next();
    });
}

//  REST interface for feeds 
//
var feedsInterface = function() {
    var router  = express.Router();
    router.all('*', loadFeeds);

    router.route('/')
        .get(function(req, res) {
            res.end(JSON.stringify(_feeds));
        });

    //  return xml data
    router.route('/youview/bbc_nitro.xml')
        .get(function(req, res) {
            var _uri = req.query.uri || null;
            if (_uri) {
                getXML(_uri).then(function(xml) {
                    res.setHeader('Content-Type', 'application/xml');
                    res.end(xml);
                })
            }else{
                res.end(JSON.stringify(common.errors.invalid_data));
            }
        });

    //  hardwired for now, catch the request to atlas so we can run 
    //  auth checks before returning any data
    router.route('/youview/bbc_nitro/:endpoint')
        .get(function(req, res) {
            proxyRequest(req.params.endpoint, req).then(function(result) {
                var _output;
                res.end(JSON.stringify(result));
            }, function(err) {
                console.error(err)
                res.end(JSON.stringify(common.errors.request_error));
            });
        });

    // For getting data about a particular transaction 
    router.route('/youview/bbc_nitro/transactions/:transaction.json')
        .get(function(req, res) {
            proxyRequest('transactions/'+req.params.transaction+'.json', req).then(function(result) {
                res.end(JSON.stringify(result));
            }, function(err) {
                console.error(err)
                res.end(JSON.stringify(common.errors.request_error));
            });
        });

    return router;
}

module.exports = feedsInterface;
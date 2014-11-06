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
    _apikey     = null;


//  Used for proxying requests to atlas and returning the result
//
//  @returns promise
//
function proxyRequest(endpoint, request) {
    var defer           = Q.defer(),
        _endpoint       = endpoint,
        _annotations    = request.query.annotations || null,
        query           = qs.stringify({ apiKey: _apikey, annotations: _annotations });
    Atlas.request('/3.0/feeds/youview/bbc_nitro/'+_endpoint+'?'+query, 'GET', function(status, data) {
        defer.resolve(JSON.parse(data));
    });
    return defer.promise;
}

function getXML(uri) {
    var defer = Q.defer(),
        _uri = uri || null,
        query = qs.stringify({apiKey: _apikey, uri: _uri});
    if (_uri) {
        Atlas.request('/3.0/feeds/youview/bbc_nitro.xml?'+query, 'GET', function(status, data) {
            defer.resolve(data);
        });
    }
    return defer.promise;
}

//  REST interface for feeds 
//
var feedsInterface = function() {
    var router  = express.Router();
    var _feeds = [{
        name: "BBC to YouView",
        location: "/feeds/youview",
        endpoint: "/3.0/feeds/youview"
    }];

    Feeds.getAll().then(function(feeds) {
        _apikey = feeds[0].apiKey;
    })

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
'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    http        = require('http'),
    Q           = require('q'),
    _           = require('lodash'),
    Atlas       = require('../services/atlasProvider');


//  Used for proxying requests to atlas
//
//
function proxyRequest(request) {
    var defer = Q.defer(),
        _endpoint = request.params.endpoint,
        _apikey = request.query.apiKey || null,
        _annotations = request.query.annotations || null;

    Atlas.request('/3.0/feeds/youview/bbc_nitro/'+_endpoint+'.json?apiKey='+_apikey, 'GET', function(status, data) {
        defer.resolve(JSON.parse(data));
    });
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

    router.route('/')
        .get(function(req, res) {
            res.end(JSON.stringify(_feeds));
        });

    //  hardwired for now: catch the request to atlas so we can run 
    //  auth checks before returning any data
    router.route('/youview/bbc_nitro/:endpoint.json')
        .get(function(req, res) {
            var _apikey = req.query.apiKey || null,
                _annotations = req.query.annotations || null;
            if (!_apikey) {
                res.end(JSON.stringify(common.errors.no_data));
            }else{
                proxyRequest(req).then(function(result) {
                    res.end(JSON.stringify(result));
                }, function(err) {
                    console.error(err)
                    res.end(JSON.stringify(common.errors.request_error));
                });
            }
        });

    return router;
}

module.exports = feedsInterface;
'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    http        = require('http'),
    Q           = require('q'),
    _           = require('lodash'),
    Atlas       = require('../services/atlasProvider');


//  Used for proxying requests to atlas and returning the result
//
//  @returns promise
//
function proxyRequest(request) {
    var defer = Q.defer(),
        _apikey = '1a8c17b3ed3040aca8c30a46bd38e685',
        _endpoint = request.params.endpoint,
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
            var _annotations = req.query.annotations || null;

            proxyRequest(req).then(function(result) {
                res.end(JSON.stringify(result));
            }, function(err) {
                console.error(err)
                res.end(JSON.stringify(common.errors.request_error));
            });
        });

    return router;
}

module.exports = feedsInterface;
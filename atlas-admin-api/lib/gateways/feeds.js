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

function getAPIKey() {
    for (var feed in _feeds) {
        if (_feeds[feed].name == 'BBC to YouView') {
            return _feeds[feed].apiKey;
        }
    }
    return null;
}

//  Used for proxying requests to atlas and returning the result
//
//  @returns promise
//
function proxyRequest(endpoint, request) {
    var defer           = Q.defer(),
        _endpoint       = endpoint,
        _annotations    = request.query.annotations || null,
        _querystring    = { apiKey: getAPIKey() };

    for (var query in request.query) {
        if ('status' === query 
            || 'uri' === query 
            || 'remote_id' === query
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
        query = qs.stringify({apiKey: getAPIKey(), uri: _uri});
    if (_uri) {
        Atlas.api('/3.0/feeds/youview/bbc_nitro.xml?'+query, 'GET', function(status, data) {
            defer.resolve(data);
        });
    }
    return defer.promise;
}

function loadFeeds(req, res) {
    Feeds.getAll().then(function(feeds) {
        _feeds = feeds;
        res.end(JSON.stringify(_feeds));
    });
}

//  REST interface for feeds 
//
var feedsInterface = function() {
    var router  = express.Router();

    router.route('/').get(loadFeeds);

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



    //  actions endpoint. actions must be sent to a processing url   
    router.route('/youview/bbc_nitro/action/:action')
        .post(function(req, res) {
            if (!_.isString(req.body.uri)) {
                res.end();
                return false
            }

            var data;
            var uri = req.body.uri;
            var action = req.params.action || '';
            var request_opts = {
                hostname: 'processing.stage.atlas.mbst.tv',
                path: '/feeds/youview/bbc_nitro/'+action+'?uri='+uri,
                method: 'post',
                agent: false
            }

            console.log('Trigger action: processing.stage.atlas.mbst.tv/feeds/youview/bbc_nitro/'+action+'?uri='+uri);

            var action_request = http.request(request_opts, function(action_res) {
                action_res.setEncoding('utf8');
                action_res.on('data', function(chunk) {
                    data += chunk;
                })
                action_res.on('end', function() {
                    res.end();
                })
            });

            action_request.on('error', function() {
                console.error('Failed to get a response from processing server');
                res.end();
            });

            action_request.end();
        })



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

    // For getting data about a particular task 
    router.route('/youview/bbc_nitro/tasks/:task.json')
        .get(function(req, res) {
            proxyRequest('tasks/'+req.params.task+'.json', req).then(function(result) {
                res.end(JSON.stringify(result));
            }, function(err) {
                console.error(err)
                res.end(JSON.stringify(common.errors.request_error));
            });
        });

    return router;
}

module.exports = feedsInterface;
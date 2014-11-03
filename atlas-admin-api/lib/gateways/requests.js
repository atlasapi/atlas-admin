'use strict';
var config      = require('../../config'),
    Q           = require('q'),
    common      = require('../../common'),
    Atlas       = require('../services/atlasProvider'),
    qs          = require('querystring'),
    express     = require('express'),
    http        = require('http'),
    _           = require('lodash'),
    ObjectID    = require('mongodb').ObjectID;


//  Make a call to atlas to create the request, then ask for all
//  requests so we can grab the request id and store it for later
//
//  @param appId {string}
//  @param sourceId {string}
//  @returns promise 
//
var sendSourceToAtlas = function(appId, sourceId) {
    var defer = Q.defer();
    if (typeof appId !== 'string' || typeof sourceId !== 'string') {
        defer.reject('appId and sourceId not present');
        return false;
    }
    var qsData = qs.stringify({
        appId: appId,
        appUrl: '',
        reason: '',
        usageType: 'personal',
        licenseAccepted: true
    })
    Atlas.request('/sources/'+sourceId+'/requests?'+qsData, 'POST', function(status, data) {
        if (status === 200) {
            defer.resolve(data);
        }else{
            defer.reject(status);
        }
    });
    return defer.promise;
}

//  For approving the request to a source based on request_id
//
//  @param request_id {string}
//  @returns promise
//
var approveSourceRequest = function(request_id) {
    var defer = Q.defer();
    if (!_.isString(request_id)) { 
        defer.reject('approveSourceRequest(): request_id must be a string');
        return;
    }
    Atlas.request('/requests/'+request_id+'/approve', 'POST', function(data) {
        defer.resolve(data);
    });
    return defer.promise;
}

//  For automatically approving a request if the logged in
//  user has admin privileges
//
//  @param appId {string}
//  @param sourceId {string}
//  @returns promise
//  
var autoApproveAdmin = function(appId, sourceId) {
    var defer = Q.defer();
    getRequestInfo(appId, sourceId).then(function(request) {
        if (_.isObject(request)) {
            approveSourceRequest(request.id).then(function success() {
                defer.resolve();
            }, 
            function error(err) {
                defer.reject(err);
            });
        }else{
            defer.reject('No request object present')
        }
    })
    return defer.promise;
}

//  Used for getting a request object from Atlas
//
//  @param appId {string}
//  @param sourceId {string}
//  @returns promise
//  
var getRequestInfo = function(appId, sourceId) {
    var defer = Q.defer();
    Atlas.request('/requests.json', 'GET', function(status, data) {
        var data = JSON.parse(data);
        var request = _.find(data['source_requests'], function(n) {
            return (n.application_id == appId && n.source.id == sourceId)? true : false;
        })
        defer.resolve(request);
    })
    return defer.promise;
}


//  For exposing the REST interface to source requests feature
//
//  @param db {object} the mongo database object
//
function SourceRequest(db) {
    var router      = express.Router(),
        collection  = db.collection('sourceRequests');

    router.route('/')
        // used for making a request to use a source. Admin users automatically have their
        // source requests authorised 
        .post(function(req, res) {
            if (!'app' in req.body ||!'source' in req.body) {
                console.error('app and source params must be sent with POST request')
                res.end();
            }
            var isAdmin = (common.user.role === 'admin')? true : false;
            var send_to_manager = function(body) {
                if (body.source.state !== 'enableable' && body.source.state !== 'available') {
                    collection.insert(body, function(err) {
                        console.log(err);
                    });
                }
            }
            sendSourceToAtlas(req.body.app.id, req.body.source.id).then(function success() {
                var body = req.body;
                if (isAdmin) {
                    autoApproveAdmin(body.app.id, body.source.id).then(function success() {
                        res.end();
                    }, function error(err) {
                        console.error('Could not auto approve source request for admin user');
                        send_to_manager(body)
                        res.end();
                    });
                }else{
                    res.end();
                    send_to_manager(body);
                }
            }, function error(status) { 
                console.error(status); 
                res.end();
            })
        })
        
        // used for returning all requests flagged as 'not approved'
        .get(function(req, res) {
            collection.find({state: 'not approved'}, {}).toArray(function(err, data) {
                if (err) throw err;
                res.end(JSON.stringify(data));
            })
        })

        // used for updating request status on atlas and in request manager
        .put(function(req, res) {
            getRequestInfo(req.body.appId, req.body.sourceId).then(function success(request) {
                if (!_.isObject(request)) {
                    res.end();
                    return;
                }
                var appId = req.body.appId,
                    sourceId = req.body.sourceId,
                    new_state = req.body.new_state,
                    request_id = request.id;

                if (!_.isString(appId) || !_.isString(request_id) || !_.isString(new_state)) {
                    res.end()
                    return;
                }
                approveSourceRequest(request_id).then(function success() {
                    collection.update( {'app.id': appId, 'source.id': sourceId}, {$set: {state: new_state}}, function(err, count, status) {
                        if (err) throw err;
                        var stringStatus = JSON.stringify(status);
                        res.end(stringStatus);
                    })
                },
                function error() {
                    console.error('Could not approve source request: '+request_id);
                    res.end()
                });
            })
        })
    return router;
}

module.exports = SourceRequest;

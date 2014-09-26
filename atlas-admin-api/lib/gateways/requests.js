'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    Atlas       = require('../services/atlasProvider'),
    qs          = require('querystring'),
    express     = require('express'),
    http        = require('http'),
    _           = require('lodash'),
    ObjectID    = require('mongodb').ObjectID;


//  make a call to atlas to create the request, then ask for all
//  requests so we can grab the request id and store it for later
//  @param appId {string}
//  @param sourceId {string}
//  @param callback {function} @returns request object
var sendSourceToAtlas = function(appId, sourceId, callback) {
    if (typeof appId !== 'string' || typeof sourceId !== 'string') {
        console.error('appId and sourceId not present');
        return false;
    }
    var postData = qs.stringify({
        appId: appId,
        appUrl: '',
        reason: '',
        usageType: 'personal',
        licenseAccepted: true
    })
    Atlas.request('/sources/'+sourceId+'/requests?'+postData, 'POST', function(status, data) {
        if (status === 200) {
           callback(true);
        }
    });
}

var approveSourceRequest = function(request_id, callback) {
    if (!_.isString(request_id)) { console.error('request_id must be a string'); return; }
    Atlas.request('/requests/'+request_id+'/approve', 'POST', function(data) {
        if (_.isFunction(callback)) callback();
    });
}

var autoApproveAdmin = function(appId, sourceId, callback) {
    var _err = false;
    getRequest(appId, sourceId, function(request) {
        if (_.isObject(request)) {
            approveSourceRequest(request.id);
        }else{
            console.error('No request object present')
            _err = true;
        }
        if (_.isFunction(callback)) callback(_err)
    })
}

var getRequest = function(appId, sourceId, callback) {
    Atlas.request('/requests.json', 'GET', function(status, data) {
        var data = JSON.parse(data);
        var request = _.find(data['source_requests'], function(n) {
            return (n.application_id == appId && n.source.id == sourceId)? true : false;
        })
        if (_.isFunction(callback)) callback(request);
    })
}


// create REST interface for source requests feature
// @param db {object} the mongo database object
var sourceRequest = function(db) {
    var router      = express.Router(),
        collection  = db.collection('sourceRequests');

    router.route('/')
        .post(function(req, res) {
            if (!'app' in req.body ||!'source' in req.body) return false;
            var isAdmin = (common.user.role === 'admin')? true : false;
            sendSourceToAtlas(req.body.app.id, req.body.source.id, function() {
                var body = req.body;
                var send_to_manager = function() {
                    if (body.source.state != 'enableable' && body.source.state != 'available') {
                        collection.insert(req.body, function() {
                            res.end();
                        })
                    }
                }
                if (isAdmin) {
                    autoApproveAdmin(body.app.id, body.source.id, function() {
                        if (err) {
                            send_to_manager()
                        }else{
                            res.end();
                        }
                    });
                }else{
                    send_to_manager();
                }
            })
        })
        
        .get(function(req, res) {
            collection.find({state: 'not approved'}, {}).toArray(function(err, data) {
                if (err) throw err;
                res.end(JSON.stringify(data));
            })
        })

        // used for updating request status on atlas and in request manager
        .put(function(req, res) {
            getRequest(req.body.appId, req.body.sourceId, function(request) {
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
                    return false;
                }

                approveSourceRequest(request_id, function() {
                    collection.update( {'app.id': appId, 'source.id': sourceId}, {$set: {state: new_state}}, function(err, count, status) {
                        if (err) throw err;
                        var stringStatus = JSON.stringify(status);
                        res.end(stringStatus);
                    })
                });
            })
        })
    return router;
}

module.exports = sourceRequest;
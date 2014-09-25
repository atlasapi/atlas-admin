'use strict';
var config      = require('../../config'),
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
//  @param enable {bool}
//  @param callback {function} @returns request object
var sendSourceToAtlas = function(appId, sourceId, enable, callback) {
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
    Atlas.request('/sources/'+sourceId+'/requests?'+postData, 'POST', function() {
        Atlas.request('/requests.json', 'GET', function(status, data) {
            var data = JSON.parse(data);
            var request = _.find(data['source_requests'], function(n) {
                return (n.application_id == appId && n.source.id == sourceId)? true : false;
            })
            if (_.isFunction(callback)) { callback(request) };
        })
    });
}

var approveSourceRequest = function(request_id, callback) {
    if (!_.isString(request_id)) { console.error('request_id must be a string') }
    Atlas.request('/requests/'+request_id+'/approve', 'POST', function(data) {
        if (_.isFunction(callback)) callback();
    });
}


// create REST interface for source requests feature
// @param db {object} the mongo database object
var sourceRequest = function(db) {
    var router      = express.Router(),
        collection  = db.collection('sourceRequests');

    router.route('/')
        .post(function(req, res) {
            if (!'app' in req.body ||!'source' in req.body) return false;
            sendSourceToAtlas(req.body.app.id, req.body.source.id, false, function(request) {
                var body = req.body;
                body.request = request;
                // only send source to manager if it requires approval
                if (body.source.state != 'enableable' && body.source.state != 'available') {
                    collection.insert(req.body, function(err, data) {
                        if (err) throw err;
                        res.end();
                    })
                }else{
                    res.end();
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
            var id = req.body.id,
                request_id = req.body.request_id,
                new_state = req.body.new_state;
            if (!_.isString(id) || !_.isString(request_id) || !_.isString(new_state)) {
                res.end('')
                return false;
            }
            approveSourceRequest(request_id, function() {
                collection.update( {_id: new ObjectID(id)}, {$set: {state: new_state}}, function(err, count, status) {
                    if (err) throw err;
                    var stringStatus = JSON.stringify(status);
                    res.end(stringStatus);
                })
            });
        })
    return router;
}

module.exports = sourceRequest;
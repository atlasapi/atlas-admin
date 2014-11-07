'use strict';
var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    ObjectID    = require('mongodb').ObjectID,
    _           = require('lodash');

//  Used for finding out if requested endpoint is protected, and 
//  if the user is allowed access or not
//
function checkAccessRights(req, res, next) {
    next();
}

//  Used for returning a list of uri's that the user is allowed access to
//
//  @param db {mongodb database object}
//  
function getUserPermissions(db) {
    var router                      = express.Router(),
        userPermissionsCollection   = db.collection('userPermissions'),
        groupsCollection            = db.collection('groups');

    router.route('/').get(function(req, res) {
        var _user = common.user;
        userPermissionsCollection.find({"userId": _user.id}, {}).toArray(function(err, data) {
            if (_.isEmpty(data)) {
                res.end(JSON.stringify(common.errors.not_permitted));
            }else{
                var _groups = [];
                if (!_.isEmpty(data[0].groups)) {
                    for (var i in data[0].groups) {
                        var getGroups = function(i) {
                            groupsCollection.find({"_id": ObjectID(data[0].groups[i])}, {}).toArray(function(err, group) {
                                _groups.push(group);
                                if (i == (data[0].groups.length - 1)) {
                                    res.end(JSON.stringify(_groups));
                                }
                            })
                        }(i);
                    }
                }else{
                    res.end();
                }
            }
        });

    });

    return router;
}

module.exports = {
    middleware: checkAccessRights,
    query: getUserPermissions
}
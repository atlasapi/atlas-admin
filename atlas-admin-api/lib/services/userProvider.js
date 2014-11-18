'use strict';
var common = require('../../common'),
    config = require('../../config'),
    Q      = require('q'),
    _      = require('lodash');


function User() {
    var db            = common.db || null;
    var collections   = {
            groups: db.collection('groups')
        };


    //  Used for finding out which groups this user has access too
    //
    //  @returns promise
    //
    var listGroups = function() {
        var defer           = Q.defer(),
            _currentuser    = common.user || null,
            groups          = null;

        if (_.isEmpty(_currentuser)) {
            defer.reject(common.errors.not_permitted);
            return defer.promise;
        }

        collections.groups.find({}, {}).toArray(function(err, data) {
            groups = _.compact( _.map(data, function(n) {
                if (_currentuser.role === 'admin') {
                    return { name: n.groupName, data: n.data };
                }else if (_.isArray(n.users)) {
                    for (var user in n.users) {
                        if (n.users[user] === _currentuser.id) {
                            return { name: n.groupName, data: n.data };
                        }
                    }
                }
            }));

            if (!_.isEmpty(groups)) {
                defer.resolve(groups)
            }else{
                defer.reject(common.errors.not_permitted)
            }
        });
        return defer.promise;
    }


    //  Used for finding out if the loggied in user is part of a certain group
    //
    //  @param groupname {string}
    //  @returns promise
    //
    var isUserinGroup = function(groupname) {
        var defer = Q.defer();
        return defer.promise;
    }

    return {
        groups: listGroups,
        inGroup: isUserinGroup
    }
}

module.exports = User();
'use strict';
var common = require('../../common'),
    config = require('../../config'),
    Q      = require('q'),
    _      = require('lodash');


function User() {
    var db            = common.db || null,
        collections   = {
            groups: db.collection('groups')
        };

    //  Used for finding out which groups this user has access too
    //
    //  @returns promise
    //
    var listGroups = function() {
        var defer           = Q.defer(),
            _currentuser    = common.user || null;

        if (_.isEmpty(_currentuser)) {
            defer.reject();
            return defer.promise;
        }

        collections.groups.find({}, {}).toArray(function(err, data) {
            var groups = _.compact( _.map(data, function(n) {
                if (_.isArray(n.users)) {
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
                defer.reject()
            }
        });
        return defer.promise;
    }

    var isUserinGroup = function(groupname) {

    }

    return {
        groups: listGroups
,        inGroup: isUserinGroup
    }
}

module.exports = User();
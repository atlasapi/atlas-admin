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
                
                // spit out all groups for admins
                if (_currentuser.role === 'admin') {
                    return { name: n.groupName, data: n.data };

                // figure out which croups the signed in user has access to
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
                defer.resolve({});
            }
        });
        return defer.promise;
    }

    return {
        groups: listGroups
    }
}

module.exports = User();
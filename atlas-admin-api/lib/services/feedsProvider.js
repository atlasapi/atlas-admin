'use strict';
var common  = require('../../common'),
    config  = require('../../config'),
    User    = require('./userProvider'),
    Q       = require('q'),
    _       = require('lodash');


function Feeds() {

    // return all feeds for this user
    var getAllFeeds = function() {
        var defer = Q.defer(),
            feeds = [];

        User.groups().then(function(groups) {
            feeds = _.map(groups, function(n) {
                if (_.isArray(n.data.feeds)) {
                    return n.data.feeds;
                }
            });
            defer.resolve(_.compact(feeds)[0]);
        }, defer.reject);
        return defer.promise;
    };

    return {
        getAll: getAllFeeds
    };
}

module.exports = Feeds();

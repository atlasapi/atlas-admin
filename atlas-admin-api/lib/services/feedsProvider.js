'use strict';
var common  = require('../../common');
var config  = require('../../config');
var User    = require('./userProvider');
var Q       = require('q');
var _       = require('lodash');

function feedsProvider() {

    // return all feeds for this user
    var getAllFeeds = function() {
        var defer = Q.defer();
        var feeds = [];

        User.groups().then(function(groups) {
            feeds = _.map(groups, function(n) {
              if (! _.isArray(n.data.feeds)) {
                return console.warn('No feed data was returned');
              }
              return n.data.feeds;
            });
            defer.resolve(_.compact(feeds)[0]);
        }, defer.reject);
        return defer.promise;
    };

    return {
        getAll: getAllFeeds
    };
}

module.exports = feedsProvider();

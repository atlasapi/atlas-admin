'use strict';
var common  = require('../../common'),
    config  = require('../../config'),
    Q       = require('q'),
    _       = require('lodash');


function Feeds() {

    var getAllFeeds = function() {
        var defer = Q.defer();

        if (common.db) {
            var feedsCollection = common.db.collection('feeds');
            feedsCollection.find({},{}).toArray(function(err, data) {
                if (err) console.log(err);
                defer.resolve(data);
            })
        }else{
            console.log('Cannot load feeds, no DB connection');
            defer.reject('No database connection');
        }

        return defer.promise;
    }

    return {
        getAll: getAllFeeds
    }
}

module.exports = Feeds();
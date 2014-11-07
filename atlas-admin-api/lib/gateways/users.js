'use strict';

var config      = require('../../config'),
    common      = require('../../common'),
    express     = require('express'),
    _           = require('lodash'),
    ObjectID    = require('mongodb').ObjectID;

// REST interface for wishlist
//
// @param db {object} the mongo database object
var wishlistInterface = function(db) {
    var router  = express.Router(),
        groups = db.collection('groups');

    router.route('/permissions')
    .get(function(req, res) {
        var _userid = common.user.id;
        groups.find({}, {}).toArray(function(err, data) {
            var groups = _.compact( _.map(data, function(n) {
                if (_.isArray(n.users)) {
                    for (var user in n.users) {
                        if (n.users[user] === _userid) {
                            return { data: n.data, name: n.groupName };
                        }
                    }
                }
            }) );
            res.statusCode = 200;
            res.end(JSON.stringify(groups));
        });
    })

    return router;
}

module.exports = wishlistInterface;
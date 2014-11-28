'use strict';
var common = require('../../common');

module.exports = function(req, res, next) {
    var _qs = req.query;
    var _debuginfo = {
        "screen name": common.user.screen_name,
        "auth": common.oauth
    }
    if (typeof _qs.debug !== 'undefined') console.log(_debuginfo);
    next();
}
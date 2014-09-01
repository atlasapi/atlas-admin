var config = require('../config');
var httpProxy = require('http-proxy');
var proxyServer = httpProxy.createProxyServer();

// proxy auth requests
var authProxy = function(req, res, next) {
    'use strict'
    console.log(req.url);
    proxyServer.web(req, res, { target: 'http://'+config.atlasHost })
}

module.exports = authProxy;
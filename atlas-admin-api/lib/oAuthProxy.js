var config = require('../config');
var common = require('../common');
var http = require('http');
var url = require('url');

// proxy auth request to atlas auth server before making requests
var oAuthProxy = function(request, response, next) {
    'use strict'
    var qs = url.parse(request.url, true).query;
    var responder = {
        body: '',
        not_authenticated: function(r) {
            r.statusCode = 400;
            r.send({
                "error": "NOT AUTHENTICATED"
            });
        },
        authenticated: function(r) {
            r.statusCode = 200;
            common.oauth.provider = qs.oauth_provider;
            common.oauth.token = qs.oauth_token;
        },
        writeBody: function(chunk) {
            this.body += chunk;
        }
    }

    if ( 'oauth_provider' in qs && 'oauth_token' in qs ) {
        var proxyOpts = {
            host: config.atlasHost,
            port: 80,
            path: '/4/users.json?oauth_provider='+qs.oauth_provider+'&oauth_token='+qs.oauth_token,
            method: 'GET'
        }

        var req = http.request(proxyOpts, function(res) {
            res.setEncoding('utf8');
            res.set('Content-Type', 'application/json');
            var status = res.statusCode;
            if (status === 200) {
                responder.authenticated(response);
            }else{
                responder.not_authenticated(response);
            }
            res.on('data', function(chunk) {
                responder.writeBody(chunk);
            })
            .on('end', function() { 
                common.user = responder.body;
                next();
            });
        });
        req.end();
    }else{
        responder.not_authenticated(response);
        next();
    }
}

module.exports = oAuthProxy;

var config = require('../config');
var http = require('http');
var url = require('url');

// proxy auth requests to atlas auth server before making requests
var oAuthProxy = function(request, response, next) {
    'use strict'
    var qs = url.parse(request.url, true).query;
    var responder = {
        body: '',
        not_authenticated: function(r) {
            r.send('NOT AUTHENTICATED');
            r.statusCode = 400;
        },
        authenticated: function(r) {
            r.statusCode = 200;
        },
        writeBody: function(chunk) {
            this.body += chunk;
        },
        sendBody: function(r) {
            r.send(this.body);
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
                if (status === 200) responder.sendBody(response);
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

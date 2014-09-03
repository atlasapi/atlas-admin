var config = require('../config');
var http = require('http');
var url = require('url');

// proxy auth requests to atlas auth server before making requests
var oAuthProxy = function(request, response, next) {
    'use strict'
    var data = ''
    var qs = url.parse(request.url, true).query;

    if ( 'oauth_provider' in qs && 'oauth_token' in qs ) {
        var proxyOpts = {
            host: config.atlasHost,
            port: 80,
            path: '/4/users.json?oauth_provider='+qs.oauth_provider+'&oauth_token='+qs.oauth_token,
            method: 'GET'
        }
        var req = http.request(proxyOpts, function(res) {
            res.setEncoding('utf8')
            var status = res.statusCode;
            res.on('data', function(chunk) {
                data += chunk;
            })
            .on('end', function() {
                //response.end(data);
                if (status === 200) {
                    console.log('authenticated');
                }else{
                    response.end( data );
                    console.log('error');
                }
                next();
            });
        });
        req.end();
    }else{
        response.writeHead(403);
        response.end( 'NOT AUTHENTICATED' );
        next();
    }
}

module.exports = oAuthProxy;
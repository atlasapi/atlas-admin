var common = require('../../common'),
    config = require('../../config'),
    http   = require('http');

var Atlas = function() {
    'use strict';

    var appendOauthToken = function(path) {
        if (!common.oauth.token || !common.oauth.provider) return false;
        var path = path || '',
            prepend = (path.indexOf('?') > -1)? '&' : '?';
        return path+prepend+'oauth_provider='+common.oauth.provider+'&oauth_token='+common.oauth.token;
    }

    var request = function(path, type, callback) {
        var type = type || 'GET';
        var path = path || '';
        var opts = {
            port: 80,
            method: type,
            host: config.atlasHost,
            path: appendOauthToken('/4'+path),
            headers: {
                'Accept': 'application/json'
            }
        }

        var request = http.request(opts, function(response) {
            response.setEncoding('utf8');
            var data = '',
                status = response.statusCode;
            response.on('data', function(chunk) {
                data += chunk;
            })
            .on('end', function() { 
                return (typeof callback === 'function')? callback(status, data) : null;
            });
        });
        request.end();
    }

    return {
        appendOauthToken: appendOauthToken,
        request: request
    }
}

module.exports = Atlas();
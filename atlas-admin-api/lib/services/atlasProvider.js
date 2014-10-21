'use strict';
var common = require('../../common'),
    config = require('../../config'),
    http   = require('http'),
    _      = require('lodash');

var Atlas = function() {
    function appendOauthToken(path) {
        if (!common.oauth.token || !common.oauth.provider) return false;
        var path = path || '',
            prepend = (path.indexOf('?') > -1)? '&' : '?';
        return path+prepend+'oauth_provider='+common.oauth.provider+'&oauth_token='+common.oauth.token;
    }

    function request(path, type, callback) {
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
                if (_.isFunction(callback)) callback(status, data);
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
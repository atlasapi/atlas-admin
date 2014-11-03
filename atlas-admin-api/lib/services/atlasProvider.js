'use strict';
var common = require('../../common'),
    config = require('../../config'),
    http   = require('http'),
    _      = require('lodash');

function Atlas() {

    //  used for wrapping a request with the signed in user's oauth token
    //
    //  @param path {string}
    //
    function appendOauthToken(path) {
        if (!common.oauth.token || !common.oauth.provider) return false;
        var path = path || '',
            prepend = (path.indexOf('?') > -1)? '&' : '?';
        return path+prepend+'oauth_provider='+common.oauth.provider+'&oauth_token='+common.oauth.token;
    }


    //  used for making a authenticated request to Atlas
    //
    //  @param path {string}
    //  @param type {string} POST, GET, etc
    //  @param callback {function}
    //
    function request(path, type, callback) {
        var type = type || 'GET';
        var path = path || '';
        var opts = {
            port: 80,
            method: type,
            host: config.atlasHost,
            path: appendOauthToken(path),
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
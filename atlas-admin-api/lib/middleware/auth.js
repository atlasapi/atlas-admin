'use strict';
var config = require('../../config'),
    common = require('../../common'),
    http = require('http'),
    url = require('url');

// proxy auth request to atlas auth server
var auth = function(request, response, next) {
    var qs = url.parse(request.url, true).query;

    //  respond to different auth outcomes
    //
    //  response                – the http response object that the responder will interact with
    //  not_authenticated()     — send not authenticated message back in the response
    //  authenticated()         — send authenticated status, and store auth and user info in common
    //  writeBody()             — write to the body property
    var responder = {
        body: '',
        response: null,
        not_authenticated: function() {
            this.response.statusCode = 400; // catch all - should be 401
            this.response.send({
                'error': 'Not authenticated'
            });
        },
        authenticated: function() {
            this.response.statusCode = 200;
            common.oauth.provider = qs.oauth_provider;
            common.oauth.token = qs.oauth_token;
            common.user = JSON.parse(this.body).user;
        },
        writeBody: function(chunk) {
            this.body += chunk;
            return;
        },
        error: function (err) {
            console.log('Auth request error', err.message);
            this.response.send({
                "error": "Server error occurred"
            });
        }
    };

    responder.response = response;

    //  if the oauth details are present in the querystring, go ahead
    //  and request the current signed-in user's details from Atlas, and
    //  store in the common module for use by other parts of the app
    if ( 'oauth_provider' in qs && 'oauth_token' in qs ) {

        var auth_endpoint = '/4/auth/user.json?oauth_provider='+qs.oauth_provider+'&oauth_token='+qs.oauth_token;

        //  check if the auth server wants to redirect the request, and follow it,
        //  otherwise, handle the request as normal
        //
        //  @param res {object} http response object
        var handleAuth = function(res) {
            if (res.statusCode >= 300 && res.statusCode < 400) {
                var redirectUrl = url.parse(res.headers.location);
                if (!redirectUrl.host) redirectUrl.host = config.atlasHost;

                var redirectOpts = {
                    host: redirectUrl.host,
                    port: 80,
                    path: redirectUrl.path,
                    method: 'GET',
                    agent: false
                };

                res.on('error', function (err) {
                    responder.error(err);
                });

                http.request(redirectOpts, function(redirect_res) {
                    res.setEncoding('utf8');
                    redirect_res.on('data', function(chunk) {
                        responder.writeBody(chunk);
                    })
                   .on('end', function() {
                        responder.authenticated();
                        next();
                    });
                })
                    .on('error', function (err) {
                        responder.error(err);
                    })
                    .end();
            }else{
                if (res.statusCode === 200) {
                    responder.authenticated();
                    next();
                }else if (res.statusCode > 500) {
                    responder.error();
                }else{
                    responder.not_authenticated();
                }
            }
        };

        // make the request to Atlas, and pass response to handleAuth()
        var authOpts = {
            host: config.atlasHost,
            port: 80,
            path: auth_endpoint,
            method: 'GET',
            agent: false

        };
        var auth = http.request(authOpts, handleAuth);
        auth.on('error', function (err) {
            responder.error(err);
        });
        auth.end();
    }else{
        responder.not_authenticated();
    }
};

module.exports = auth;

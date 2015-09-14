'use strict';
var app = angular.module('atlasAdmin.services.atlas', []);

app.factory('Atlas', function ($http, atlasHost, atlasVersion, Authentication, $log) {
    return {
        getRequest: function(url) {
            var usersUrl = Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion +  url);
            console.log('get-> ' + usersUrl);
            return $http.get(usersUrl);
        },
        getUrl: function (url) {
            return Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url);
        },
        postRequest: function(url, data) {
            return $http.post(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url), data, {withCredentials: false});
        },
        deleteRequest: function(url) {
            return $http.delete(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url));
        },
        getAuthProviders: function() {
            return $http.get(atlasHost + "/" + atlasVersion + "/auth/providers.json").then(function(results){
                return results.data.auth_providers;
            }, function(error) {
                $log.error(error);
            });
        },
        startOauthAuthentication: function(provider, callbackUrl, targetUri) {
            var url = atlasHost + provider.authRequestUrl + ".json?callbackUrl=" + callbackUrl;
            Authentication.setProvider(provider.namespace);
            return $http.get(url).then(function(result) {
                return result.data.oauth_request.login_url;
            }, function(error) {
                console.error(error);
                return error;
            });
        },
        getAccessToken: function(oauth_token, oauth_verifier, code) {
            var url = "/auth/" + Authentication.getProvider() + "/token.json?oauthToken=" + oauth_token
                    + "&oauthVerifier=" + oauth_verifier + "&code=" + code;
           return $http.get(atlasHost + "/" + atlasVersion +  url);
        },
        startLogout: function() {
           return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + "/auth/logout.json"));
        }
    };
});

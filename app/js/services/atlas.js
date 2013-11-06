'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.atlas', []);

app.factory('Atlas', function ($http, atlasHost, atlasVersion, Authentication) {
    return {
       getRequest: function(url) {
           return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion +  url));   
       },
       postRequest: function(url, data) {
           return $http.post(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url), data, {withCredentials: false});   
       },
       deleteRequest: function(url) {
           return $http.delete(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url));
       },
       getAuthProviders: function() {
           return $http.get(atlasHost + "/" + atlasVersion + "/auth/providers.json").then(function(results){
               var authProviders = [];
               return results.data.auth_providers;
           }, function(error) {
               console.log(error);   
           });  
       },
       startOauthAuthentication: function(provider, callbackUrl, targetUri) {
          var url = atlasHost + provider.authRequestUrl + ".json?callbackUrl=" + callbackUrl;
          Authentication.setProvider(provider.namespace);
          return $http.get(url).then(function(result) {
              return result.data.oauth_request.login_url;
              
          }, function(error) {
              return error;  
          });
       },
       getAccessToken: function(oauth_token, oauth_verifier) {
           var url = "/auth/" + Authentication.getProvider() + "/token.json?oauthToken=" + oauth_token
                 + "&oauthVerifier=" + oauth_verifier;
           return $http.get(atlasHost + "/" + atlasVersion +  url); 
       },
       startLogout: function() {
           return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + "/auth/logout.json"));    
       }
    }
});
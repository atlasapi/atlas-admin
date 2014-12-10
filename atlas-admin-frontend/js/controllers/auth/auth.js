'use strict';
var app = angular.module('atlasAdmin.controllers.auth', []);

app.controller('CtrlOAuth', function($scope, $rootScope, $routeParams, $location, Authentication, Atlas, $log, Users) {
    if (window.location.search.indexOf("code") == -1 &&  window.location.search.indexOf("oauth") == -1) {
        // search part will be empty if we have been here and cleared the oauth replies
        // In this case redirect.
        $location.path("/applications");
        return;
    }

    $rootScope.title = "Signing in...";
    Authentication.setProvider($routeParams.providerNamespace);
    
    var oauth_token = "";
    var oauth_verifier = "";
    var code = "";
    var searchParts = window.location.search.replace("?","").split("&");

    for (var i in searchParts) {
        var parts = searchParts[i].split("=");
        if (parts[0] == "oauth_token") {
           oauth_token = parts[1];
        } else if (parts[0] == "oauth_verifier") {
           oauth_verifier = parts[1];
        } else if (parts[0] == "code") {
           code = parts[1];
        }
    }
    
    Atlas.getAccessToken(oauth_token, oauth_verifier, code)
        .then(function(results) {
        if (!results.data.oauth_result) {
            return;
        }
        Authentication.setToken(results.data.oauth_result.access_token);
        var redirectToSources = function() {
            window.location.search = "";
        };
        Users.currentUser().then(redirectToSources, 
            function(error) {
            $log.error("Error setting user.");
            $log.error(error);
            $location.hash("/login");
            localStorage.removeItem('auth.provider');
            localStorage.removeItem('auth.token');
            localStorage.removeItem('profile.complete');
        });
    },

    function(error) {
        $log.error("Error getting access token.");
        $log.error(error);
        $location.hash("/login");
    });
});
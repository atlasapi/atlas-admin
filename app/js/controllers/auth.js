'use strict';
var app = angular.module('atlasAdmin.controllers.auth', []);

app.controller('CtrlLogin', function($scope, $rootScope, $routeParams, Atlas, atlasVersion, $location, Authentication, $log) {
    // Ask atlas for access here 
    $rootScope.title = "Please log in";
    Authentication.reset();
    Atlas.getAuthProviders().then(function(results) {
        $scope.providers = results; 
    });
    
    $rootScope.startAuth = function(provider) {
        var callbackUrl = encodeURIComponent($location.absUrl().replace("/login","/oauth/" + provider.namespace));
        var targetUri = encodeURIComponent($location.absUrl().replace("/login","/"));
        Authentication.setProvider(provider.namespace);
        Atlas.startOauthAuthentication(provider, callbackUrl, targetUri).then(function(login_url) {
            window.location.href = login_url; 
        }, function(error) {
            $log.error(error);   
        });
    }
});

app.controller('CtrlOAuth', function($scope, $rootScope, $routeParams, $location, Authentication, Atlas, $log, Users) {
    if (window.location.search == "") {
        // search part will be empty if we have been here and cleared the oauth replies
        // In this case redirect.
        $location.path("/applications");
        return;
    }
    $rootScope.title = "Authenticating.....";
    Authentication.setProvider($routeParams.provider);
    var oauth_token = "";
    var oauth_verifier = "";
    var searchParts = window.location.search.replace("?","").split("&");
    for (var i in searchParts) {
        var parts = searchParts[i].split("=");
        if (parts[0] == "oauth_token") {
           oauth_token = parts[1];
        } else if (parts[0] == "oauth_verifier") {
           oauth_verifier = parts[1];
        }
    }
    Atlas.getAccessToken(oauth_token, oauth_verifier).then(function(results) {
        Authentication.setToken(results.data.oauth_result.access_token);
        var redirectToSources = function() {
            window.location.search = "";
        };
        Users.currentUser().then(redirectToSources, redirectToSources);
    },
    function(error) {
        $log.error(error);
        $location.hash("/login");
    });
});


app.controller('CtrlLogout', function($scope, $rootScope, $routeParams, $location, Authentication) {
    // Ask atlas for access here 
    $rootScope.title = "Logging out";
    Authentication.reset();
    $location.path("/login");
});
'use strict';
var app = angular.module('atlasAdmin.controllers.auth', []);

app.controller('CtrlLogin', function($scope, $rootScope, $rootElement, $routeParams, Atlas, atlasVersion, $location, Authentication, $log) {
    // modify title element
    var h2_el = angular.element($rootElement).find('h2');
    var app_title = _.find(h2_el, function(el) {
        return angular.element(el).hasClass('app-title');
    });
    angular.element(app_title).addClass('align-mid')
    $rootScope.title = "Hi there, please sign in to continue";
    // Ask atlas for access here 
    Authentication.reset();
    Atlas.getAuthProviders().then(function(results) {
        var providers = [];
        for (var i=0; i<results.length; i++) {
            var provider = results[i];
            provider.icon = (provider.namespace === 'google')? 'google-plus' : provider.namespace;
            providers.push(provider);
        }
        $scope.providers = providers;
        if ($routeParams.providerNamespace) {
            $rootScope.startAuth($scope.providers.filter(function (provider) {
                return provider.namespace === $routeParams.providerNamespace;
            })[0]);
        }
    });
    
    $rootScope.startAuth = function(provider) {
        var uri,
            target;
        if ($location.absUrl().indexOf('/login/' + provider.namespace) !== -1) {
            uri = $location.absUrl().replace("/login/" + provider.namespace,"/oauth/" + provider.namespace);
            target = $location.absUrl().replace("/login/" + provider.namespace,"/");
        } else {
            uri = $location.absUrl().replace("/login", "/oauth/" + provider.namespace);
            target = $location.absUrl().replace("/login","/");
        }
        
        var callbackUrl = encodeURIComponent(uri);
        var targetUri = encodeURIComponent(target);
        
        Authentication.setProvider(provider.namespace);
        Atlas.startOauthAuthentication(provider, callbackUrl, targetUri).then(function(login_url) {
            window.location.href = login_url; 
        }, function(error) {
            $log.error("Error starting auth:");
            $log.error(error);   
        });
    };
});

app.controller('CtrlOAuth', function($scope, $rootScope, $routeParams, $location, Authentication, Atlas, $log, Users) {
    if (window.location.search.indexOf("code") == -1 &&  window.location.search.indexOf("oauth") == -1) {
        // search part will be empty if we have been here and cleared the oauth replies
        // In this case redirect.
        $location.path("/applications");
        return;
    }
    $rootScope.title = "Authenticating.....";
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
    
    Atlas.getAccessToken(oauth_token, oauth_verifier, code).then(function(results) {
        if (!results.data.oauth_result) {
            return;
        }
        Authentication.setToken(results.data.oauth_result.access_token);
        var redirectToSources = function() {
            window.location.search = "";
        };
        Users.currentUser().then(redirectToSources, function(error) {
            $log.error("Error setting user.");
            $log.error(error);
        });
    },
    function(error) {
        $log.error("Error getting access token.");
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
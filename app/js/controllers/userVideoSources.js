'use strict';
var app = angular.module('atlasAdmin.controllers.uservideosources', []);

app.controller('CtrlVideoSourceProviders', function($scope, $rootScope, $location, UserVideoSources) {
    $rootScope.title = "Select video source provider";
    $scope.app = {};
    $scope.app.providers = [];
    if (window.location.search != "") {
        window.location.search = "";
    }
    UserVideoSources.allProviders().then(function(providers) {
        $scope.app.providers = providers;
    });
    
    $scope.app.startAuth = function(provider) {
        var callbackUrl = $location.absUrl().replace("/providers","/config/" + provider.namespace);
        UserVideoSources.getOAuthLogin(provider.authRequestUrl, callbackUrl).then(function(data) {
            // Redirect to remote service login screen
            window.location.href = data.login_url;
        });
    };
});
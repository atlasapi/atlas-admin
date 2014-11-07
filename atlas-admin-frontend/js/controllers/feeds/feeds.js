'use strict';
var app = angular.module('atlasAdmin.controllers.feeds', []);

app.controller('CtrlFeeds', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.view_title = 'Feeds'
    
    Feeds.get().then(function(data) {
        console.log(data);
        if (!_.isEmpty(data)) {
            $scope.feeds = data;
        }
    });
}])
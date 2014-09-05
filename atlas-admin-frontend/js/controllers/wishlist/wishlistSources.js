'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistSources', ['$scope', '$rootScope', '$routeParams', 'Sources', '$q', 
    function ($scope, $rootScope, $routeParams, Sources, $q) {
    $scope.sources = {};
    $scope.asked = [];

    Sources.all().then(function(sources) {
        console.log(sources);
        $scope.sources = sources;
        var t = 3;
        while(t--) $scope.asked.push(sources[t]);
    })
}]);
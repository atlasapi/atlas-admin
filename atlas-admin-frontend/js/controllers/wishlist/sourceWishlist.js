'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist', []);

app.controller('CtrlSourceWishlist', ['$scope', '$rootScope', '$routeParams', 'Sources', '$q', 
    function ($scope, $rootScope, $routeParams, Sources, $q) {

    $scope.wishlist = {};

    var getUnavailableSources = function() {
        var defer = $q.defer();
        Sources.all().then(function(result) {
            
        })
    }();

}]);
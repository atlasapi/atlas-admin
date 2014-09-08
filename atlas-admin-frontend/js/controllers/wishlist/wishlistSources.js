'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistSources', ['$scope', '$rootScope', '$routeParams', 'Sources', 'factoryWishlist', '$q', 
    function ($scope, $rootScope, $routeParams, Sources, Wishlist, $q) {
    $scope.sources = {};
    $scope.asked = [];

    Wishlist.all().then(function(data, status) {
        console.log(data);
        console.log(status);
    })
}]);
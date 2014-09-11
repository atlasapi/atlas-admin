'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistFeatures', ['$scope', '$rootScope', '$routeParams', '$q', 
    function ($scope, $rootScope, $routeParams, $q) {
    var root = $rootScope;
    $scope.features = {};

    root.$watch('wishlist', function(new_val, old_val) {
        $scope.features = _.filter($rootScope.wishlist, function(n) {
            return n.type === 'feature';
        })
    });
}]);
'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist', []);

app.controller('CtrlWishlist', ['$scope', '$rootScope', '$routeParams', 'factoryWishlist', 'Users', '$q', 
    function ($scope, $rootScope, $routeParams, Wishlist, Users, $q) {

    // tab state (sources | features)
    $rootScope.currentTab = 'sources';

    // request wishes for current user and inject into rootScope
    Wishlist.getUserWishes().then(function(data) {
        $rootScope.wishes = data;
    })

    // request all wishlist data and inject into rootScope
    Wishlist.all().then(function(data) {
        $rootScope.wishlist = data;
    }, 
    function(msg) { console.error(msg) });
}]);

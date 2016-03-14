'use strict';
var app = angular.module('atlasAdmin.wishlist')
  .controller('CtrlWishlist', ['$scope', '$rootScope', '$routeParams', 'factoryPropositions', 'Wishes', 'Users', '$q', 
    function ($scope, $rootScope, $routeParams, Propositions, Wishes, Users, $q) {

    // tab state (sources | features)
    $rootScope.currentTab = 'sources';

    // request wishes for current user and inject into rootScope
    Wishes.user().then(function(data) {
        $rootScope.wishes = data;
    })

    // request all wishlist data and inject into rootScope
    Propositions.all().then(function(data) {
        $rootScope.wishlist = data;
    },
    function(msg) { console.error(msg) });
}]);

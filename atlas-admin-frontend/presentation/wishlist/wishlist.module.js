'use strict';

angular.module('atlasAdmin.wishlist', [
    'ngRoute',
    'atlasAdmin.directives.inputMorph',
    'atlasAdmin.services.users',
    'atlasAdmin.services.propositions'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/wishlist', {
      templateUrl: 'presentation/wishlist/wishlist.tpl.html',
      controller: 'CtrlWishlist'
    });
  }]);

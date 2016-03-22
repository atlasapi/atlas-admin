'use strict';

angular
  .module('atlasAdmin.wishlist', [
    'ngRoute',
    'atlasAdmin.directives.inputMorph',
    'atlasAdmin.services.users',
    'atlasAdmin.services.propositions',
    'atlasAdmin.services.wishes'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/wishlist', {
      templateUrl: 'presentation/wishlist/wishlist.tpl.html',
      controller: 'CtrlWishlist'
    });
  }]);

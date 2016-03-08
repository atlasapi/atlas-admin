'use strict';

angular.module('atlasAdmin.wishlist', ['ngRoute', 'atlasAdmin.inputMorph'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/wishlist', {
      templateUrl: 'presentation/wishlist/wishlist.tpl.html',
      controller: 'CtrlWishlist'
    });
  }]);

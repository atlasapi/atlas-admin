'use strict';

angular.module('atlasAdmin.manageWishlist', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/wishlist', {
      templateUrl: 'presentation/manageWishlist/manageWishlist.tpl.html',
      controller: 'CtrlManageWishlist'
    });
  }]);

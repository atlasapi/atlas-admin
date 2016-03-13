'use strict';

angular.module('atlasAdmin.manageWishlist', [
    'ngRoute',
    'atlasAdmin.directives.deleteItem',
    'atlasAdmin.directives.changeStatus',
    'atlasAdmin.services.propositions',
    'atlasAdmin.services.wishes'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/wishlist', {
      templateUrl: 'presentation/manageWishlist/manageWishlist.tpl.html',
      controller: 'CtrlManageWishlist'
    });
  }]);

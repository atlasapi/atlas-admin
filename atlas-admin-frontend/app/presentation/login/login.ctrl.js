'use strict';

angular
  .module('atlasAdmin.login')
  .controller('CtrlLogin', CtrlLogin);

CtrlLogin.$inject = ['$scope', '$location', '$window'];

function CtrlLogin($scope, $location, $window) {
  $scope.title = "Hi there, please sign in to continue";

  var userServiceUrl = 'https://users.metabroadcast.com#login?ref=' + $location.absUrl();

  $scope.goToUserService = function () {
    $window.location = userServiceUrl;
  };
}

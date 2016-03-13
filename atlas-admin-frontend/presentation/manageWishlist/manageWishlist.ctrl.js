angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlist', ['$scope', '$rootScope', 'factoryPropositions', 'Wishes',
      function($scope, $rootScope, Propositions, Wishes) {
      $scope.app = {};
      $rootScope.requestsToday = {};
      $rootScope.currentTab = 'source-requests'

      Wishes.all().then(function(data, status) {
          $rootScope.wishes = data;
      }, function(err) { console.error(err) });

      Propositions.all().then(function(data, status) {
          $rootScope.items = data;
      }, function(err) { console.error(err) });
  }]);

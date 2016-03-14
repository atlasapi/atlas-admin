'use strict';
angular.module('atlasAdmin.feeds')
  .controller('CtrlFeeds', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.view_title = 'Feeds';

    Feeds.get().then(
    function(data) {
      if (_.isEmpty(data)) {
        return console.warn('No feed data returned');
      }
      $scope.feeds = data;
    });
}]);

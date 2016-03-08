'use strict';

// date helpers
var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlistSourceRequests', [ '$scope', '$rootScope',
      function($scope, $rootScope) {

      // filter out source wishes, then pass to the $scope
      $rootScope.$watch('wishes', function(old_val, new_val) {
          $scope.sourceWishes = _.filter($rootScope.wishes, function(n) {
              return n.wish.type === 'source';
          });
          $scope.sources_by_count = _.countBy($scope.sourceWishes, function(n) {
              return n.wish.title;
          });
          // map out number of requests from today
          $rootScope.requestsToday.sources = _.map($scope.sourceWishes, function(n) {
              if (dateFromObjectId(n._id) > yesterday) return n;
          }).length;
      });
  }]);

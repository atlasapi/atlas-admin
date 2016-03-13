'use strict';
angular.module('atlasAdmin.directives.preloader')
  .directive('preloader', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      template: '<div class="loading-container loading" ng-cloak><span class="page-loader">Loading...</span></div>',
      link: function($scope, $el, attr) {
        $scope.$on('loading-started', function(ev) {
          $el.css({'display': 'block'});
        });
        $scope.$on('loading-complete', function(ev) {
          $el.css({'display': 'none'});
        });
      }
    }
  }]);

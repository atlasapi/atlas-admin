'use strict';

/* Focus on an element. Use "focus-me" as an attribute. */

angular.module('atlasAdmin.directives.focus')
  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs, model) {
        scope.$watch('trigger', function(value) {
          $timeout(function () {
            element[0].focus();
          });
        });
      }
    };
});

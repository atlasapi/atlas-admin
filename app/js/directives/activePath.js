'use strict';

/* Highlight current menu element */
/* Thanks to http://stackoverflow.com/questions/12592472/how-to-highlight-a-current-menu-item-in-angularjs */
var app = angular.module('atlasAdmin.directives.activePath', []);

app.directive('activePath', ['$location', function(location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        var activeClass = attrs.activePath;
        var path = attrs.ngHref;
        if (path.substring(0,1) == "#") {
           path = path.substring(1);   
        }
        scope.location = location;
        scope.$watch('location.path()', function(currentPath) {
            if (path == currentPath.substring(0, path.length)) {
                element.addClass(activeClass);
            } else {
                element.removeClass(activeClass);
            }
        });
      }
    };
}]);
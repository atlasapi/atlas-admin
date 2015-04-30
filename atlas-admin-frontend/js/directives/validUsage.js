'use strict';

var app = angular.module('atlasAdmin.directives.validUsage', []);

app.directive('validUsage', function () { 
    return {
      require: 'ngModel',
      link: function(scope, ele, attrs, c) {
          scope.$watch(attrs.ngModel, function() {
              c.$setValidity('validUsage', ele[0].value != "0");
          });
      }
    }
});
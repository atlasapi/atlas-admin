'use strict';

/* Filters */

angular.module('atlasAdmin.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
.filter('title', function() {
    return function(text) {
      return String(text).substring(0,1).toUpperCase() + String(text).substring(1);
    }
})
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});;

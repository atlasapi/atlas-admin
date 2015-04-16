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
        if (input) {
            return input.slice(start);
        }
    }
})
.filter('sourceState', function() {
    return function(input, states) {
        var search = states.split("|");
        var output = [];
        for (var i in input) {
            if (search.indexOf(input[i].state) != -1) {
                output.push(input[i]);
            }
        }
        return output;
    }
})
.filter('sourceEnabled', function() {
    return function(input, isEnabled) {
        var output = [];
        for (var i in input) {
            if (input[i].enabled == isEnabled) {
                output.push(input[i]);
            }
        }
        return output;
    }
});

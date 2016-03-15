'use strict';

/* Filters */

angular.module('atlasAdmin.filters').
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
})
.filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
});

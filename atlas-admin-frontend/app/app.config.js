'use strict';

// Declare app level module which depends on filters, and services
angular.module('atlasAdmin')
  .config(['$routeProvider', '$httpProvider', '$sceDelegateProvider', function($routeProvider, $httpProvider, $sceDelegateProvider) {
      $routeProvider.otherwise({redirectTo: '/applications'});

      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.interceptors.push('LoadingInterceptor');
      $httpProvider.interceptors.push('AuthenticationInterceptor');
      $httpProvider.interceptors.push('ProfileCompleteInterceptor');

      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.metabroadcast.com/**',
        'https://*.metabroadcast.com/**'
      ]);
  }]);

'use strict';

// Declare app level module which depends on filters, and services
angular.module('atlasAdmin',
   ['atlasAdmin.interceptors',
    'atlasAdmin.filters',
    'atlasAdmin.login',
    'atlasAdmin.logout',
    'atlasAdmin.auth',
    'atlasAdmin.applications',
    'atlasAdmin.application',
    'atlasAdmin.requestSource',
    'atlasAdmin.wishlist',
    'atlasAdmin.epg',
    'atlasAdmin.scrubbables',
    'atlasAdmin.feeds',
    'atlasAdmin.feed',
    'atlasAdmin.feedBreakdown',
    'atlasAdmin.manageSources',
    'atlasAdmin.manageSourcesReaders',
    'atlasAdmin.manageSourcesWriters',
    'atlasAdmin.manageRequests',
    'atlasAdmin.manageUsers',
    'atlasAdmin.manageUser',
    'atlasAdmin.manageUsage',
    'atlasAdmin.manageWishlist',
    'atlasAdmin.terms',
    'atlasAdmin.profile',
    'atlasAdmin.contact',
    'atlasAdmin.videoSourceProviders',
    'atlasAdmin.videoSourceConfig',
    'atlasAdmin.error',
    'atlasAdmin.menu',

    'atlasAdmin.directives.preloader',
    'atlasAdmin.directives.activePath',

    'atlasAdmin.services.auth',
    'atlasAdmin.services.usage',
    'atlasAdmin.services.feeds',
    'atlasAdmin.services.bbcscrubbables',
    'ui.bootstrap',
    'ngResource',
    'ngRoute',
    'atlasAdminConfig'
  ])
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

'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', [
                        'atlasAdmin.interceptors',
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
                        'atlasAdmin.preloader',
                        'atlasAdmin.activePath',
                        'atlasAdmin.services.auth',
                        'atlasAdmin.services.atlas',
                        'atlasAdmin.services.applications',
                        'atlasAdmin.services.sources',
                        'atlasAdmin.services.sourceRequests',
                        'atlasAdmin.services.sourceLicenses',
                        'atlasAdmin.services.users',
                        'atlasAdmin.services.uservideosources',
                        'atlasAdmin.services.uservideosources.youtube',
                        'atlasAdmin.services.propositions',
                        'atlasAdmin.services.usage',
                        'atlasAdmin.services.feeds',
                        'atlasAdmin.services.bbcscrubbables',
                        'atlasAdmin.directives.validUsage',
                        'atlasAdmin.directives.inputmorph',
                        'atlasAdmin.directives.loadContent',
                        'atlasAdmin.directives.bbcscrubbables',
                        'ui.bootstrap',
                        'ngResource',
                        'ngRoute',
                        'atlasAdminConfig']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/applications'});
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('LoadingInterceptor');
    $httpProvider.interceptors.push('AuthenticationInterceptor');
    $httpProvider.interceptors.push('ProfileCompleteInterceptor');
}]);

// This is used for telling angular to allow transposing of strings
// to make url's in the $scope
app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://*.metabroadcast.com/**',
      'https://*.metabroadcast.com/**'
    ]);
}]);

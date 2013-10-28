'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', ['atlasAdmin.filters', 'atlasAdmin.services', 'atlasAdmin.directives', 'atlasAdmin.controllers','ui.bootstrap','ngResource','atlasAdminConfig']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sources', {templateUrl: 'partials/sources.html', controller: 'CtrlSources'});
    $routeProvider.when('/sources/:sourceId/readers', {templateUrl: 'partials/sourceReaders.html', controller: 'CtrlSourceReaders'});
    $routeProvider.when('/sources/:sourceId/writers', {templateUrl: 'partials/sourceWriters.html', controller: 'CtrlSourceWriters'});
    $routeProvider.when('/requests', {templateUrl: 'partials/requests.html', controller: 'CtrlRequests'});
    $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'CtrlApplications'});
    $routeProvider.when('/applications/:applicationId', {templateUrl: 'partials/applicationEdit.html', controller: 'CtrlApplicationEdit'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'CtrlLogin'});
    $routeProvider.when('/oauth/:provider', {templateUrl: 'partials/oauth.html', controller: 'CtrlOAuth', reloadOnSearch: false});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'CtrlLogout'});
    $routeProvider.otherwise({redirectTo: '/sources'});
  }]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // console.log($httpProvider);
        $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
    }
  ]);

app.config(['$locationProvider', function($locationProvider) {
    
    //$locationProvider.html5Mode(false).hashPrefix('!');
}]);



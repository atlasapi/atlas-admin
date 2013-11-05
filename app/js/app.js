'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', ['atlasAdmin.filters', 'atlasAdmin.services', 'atlasAdmin.services.sourceRequests', 'atlasAdmin.directives', 
                        'atlasAdmin.controllers','atlasAdmin.controller.user','ui.bootstrap','ngResource','atlasAdminConfig']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sources', {templateUrl: 'partials/sources.html', controller: 'CtrlSources'});
    $routeProvider.when('/sources/:sourceId/readers', {templateUrl: 'partials/sourceReaders.html', controller: 'CtrlSourceReaders'});
    $routeProvider.when('/sources/:sourceId/writers', {templateUrl: 'partials/sourceWriters.html', controller: 'CtrlSourceWriters'});
    $routeProvider.when('/requests', {templateUrl: 'partials/requests.html', controller: 'CtrlRequests'});
    $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'CtrlApplications'});
    $routeProvider.when('/applications/:applicationId', {templateUrl: 'partials/applicationEdit.html', controller: 'CtrlApplicationEdit'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'CtrlLogin'});
    $routeProvider.when('/oauth/:provider', {templateUrl: 'partials/oauth.html', controller: 'CtrlOAuth', reloadOnSearch: false});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'UserProfileController'});
    $routeProvider.when('/users/:uid', {templateUrl: 'partials/profile.html', controller: 'UserProfileController'});
    $routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'AllUsersController'});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'CtrlLogout'});
    $routeProvider.when('/error', {templateUrl: 'partials/error.html', controller: 'ErrorController'});
    $routeProvider.otherwise({redirectTo: '/sources'});
  }]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
        $httpProvider.responseInterceptors.push('ProfileCompleteInterceptor');
    }
  ]);

app.config(['$locationProvider', function($locationProvider) {
    
    //$locationProvider.html5Mode(false).hashPrefix('!');
}]);



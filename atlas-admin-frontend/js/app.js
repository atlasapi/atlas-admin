'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', [
                                'atlasAdmin.filters', 
                                'atlasAdmin.preloader', 
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
                                'atlasAdmin.directives.orderable', 
                                'atlasAdmin.directives.focus',
                                'atlasAdmin.directives.activePath',
                                'atlasAdmin.directives.validUsage',
                                'atlasAdmin.directives.inputmorph',
                                'atlasAdmin.directives.loadContent',
                                'atlasAdmin.controllers.auth',
                                'atlasAdmin.controllers.atlas',
                                'atlasAdmin.controllers.errors',
                                'atlasAdmin.controllers.applications',
                                'atlasAdmin.controllers.wishlist',
                                'atlasAdmin.controllers.sources',
                                'atlasAdmin.controllers.requestSource',
                                'atlasAdmin.controllers.sourceRequests',
                                'atlasAdmin.controllers.user',
                                'atlasAdmin.controllers.epgWidget',
                                'atlasAdmin.controllers.feeds',
                                'atlasAdmin.controllers.scrubbables',
                                'atlasAdmin.controllers.uservideosources',
                                'atlasAdmin.controllers.uservideosources.youtube',
                                'atlasAdmin.controllers.admins.usage',
                                'atlasAdmin.controllers.admins.manageSourceRequests',
                                'atlasAdmin.controllers.admins.manageWishlist',
                                'ui.bootstrap',
                                'ngResource',
                                'ngRoute',
                                'atlasAdminConfig']);


app.config(['$routeProvider', function($routeProvider) {
    // admin only routes
    $routeProvider.when('/manage/requests', {templateUrl: 'partials/admins/manageSourceRequests.html', controller: 'CtrlManageSourceRequests'});
    $routeProvider.when('/manage/sources', {templateUrl: 'partials/admins/sources.html', controller: 'CtrlSources'});
    $routeProvider.when('/manage/sources/:sourceId/readers', {templateUrl: 'partials/admins/sourceReaders.html', controller: 'CtrlSourceReaders'});
    $routeProvider.when('/manage/sources/:sourceId/writers', {templateUrl: 'partials/admins/sourceWriters.html', controller: 'CtrlSourceWriters'});
    $routeProvider.when('/manage/users', {templateUrl: 'partials/admins/users.html', controller: 'AllUsersController'});
    $routeProvider.when('/manage/users/:uid', {templateUrl: 'partials/profile.html', controller: 'UserProfileController'});
    $routeProvider.when('/manage/wishlist', {templateUrl: 'partials/admins/wishlist/manageWishlist.html', controller: 'CtrlManageWishlist'});
    $routeProvider.when('/manage/usage', {templateUrl: 'partials/admins/usage/requests.html', controller: 'CtrlUsage'});

    $routeProvider.when('/epg/bt-tv', {templateUrl: 'partials/epg-widget.html', controller: 'CtrlEPGWidget'});
    $routeProvider.when('/scrubbables', {templateUrl: 'partials/scrubbables/create.html', controller: 'CtrlScrubbables'});

    // application user routes
    $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'CtrlApplications'});
    $routeProvider.when('/applications/:applicationId', {templateUrl: 'partials/applicationEdit.html', controller: 'CtrlApplicationEdit'});
    $routeProvider.when('/applications/:applicationId/requestSource/:sourceId', {templateUrl: 'partials/requestSource.html', controller: 'CtrlRequestSource'});
    $routeProvider.when('/wishlist', {templateUrl: 'partials/wishlist/wishlist.html', controller: 'CtrlWishlist'})
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'CtrlLogin'});
    $routeProvider.when('/login/:providerNamespace', {templateUrl: 'partials/login.html', controller: 'CtrlLogin'});
    $routeProvider.when('/oauth/:providerNamespace', {templateUrl: 'partials/oauth.html', controller: 'CtrlOAuth', reloadOnSearch: false});
    $routeProvider.when('/feeds', {templateUrl: 'partials/feeds/feeds.html', controller: 'CtrlFeeds'});
    $routeProvider.when('/feeds/:feedId', {templateUrl: 'partials/feeds/console.html', controller: 'CtrlFeedsConsole'});
    $routeProvider.when('/feeds/:feedId/:taskId', {templateUrl: 'partials/feeds/breakdown.html', controller: 'CtrlFeedsBreakdown'});
    $routeProvider.when('/terms', {templateUrl: 'partials/terms.html', controller: 'UserLicenseController'});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'UserProfileController'});
    $routeProvider.when('/videosource/providers', {templateUrl: 'partials/videoSourceProviders.html', controller: 'CtrlVideoSourceProviders'});
    $routeProvider.when('/videosource/config/youtube', {templateUrl: 'partials/videoSourceYouTubeConfig.html', controller: 'CtrlVideoSourceYouTubeConfig'});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'CtrlLogout'});
    $routeProvider.when('/error', {templateUrl: 'partials/error.html', controller: 'ErrorController', reloadOnSearch: false});
    $routeProvider.otherwise({redirectTo: '/applications'});
  }])


app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // these are used for intercepting the request and running checks 
    // for authentication and profile complete-ness
    $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
    $httpProvider.responseInterceptors.push('ProfileCompleteInterceptor');

    // the loading bar will show when there are requests still pending, but will
    // be delayed slighty so we dont see the loader flashing up for pages that
    // load quickly. This also gives the illusion of faster page loads
    $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', '$timeout', 
        function($q, $rootScope, $injector, $timeout) {
        var requests = 0;
        var loadTimer;

        if (!$rootScope.show) {
            $rootScope.show = {};
        }

        var startLoading = function() {
            var _loggedin = $rootScope.status.loggedIn || false;
            if (requests > 1 && _loggedin) {
                $timeout.cancel(loadTimer);
                loadTimer = $timeout(function() {
                    $rootScope.$broadcast('loading-started');
                }, 400);
                $rootScope.show.load = true;
            }
        }

        var endLoading = function() {
            $timeout.cancel(loadTimer);
            $rootScope.$broadcast('loading-complete');
            $rootScope.show.load = false;
        }

        return {
            'request': function(config) {
                requests++;
                startLoading();
                return config || $q.when(config);
            },
            'response': function(response) {
                requests--;
                if (!requests) endLoading();
                return response || $q.when(response);
            }
        };
    }]);

    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
        return {
            request: function(config) {
                return config || $q.when(config);
            },
            response: function(response) {
                var qs = $location.search();
                if (qs.debug) {
                    var token = localStorage.getItem('auth.token');
                    console.log(token);
                }
                return response || $q.when(response);
            }
        }
    }]);
}]);



// This is used for telling angular to allow transposing of strings
// to make url's in the $scope
app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.metabroadcast.com/**'
        ]);
}]);

app.config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(false).hashPrefix('!');
}]);

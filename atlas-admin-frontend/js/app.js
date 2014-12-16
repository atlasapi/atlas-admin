'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', [
                         'atlasAdmin.interceptors', 
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
                         'atlasAdmin.services.bbcscrubbables',
                         'atlasAdmin.directives.orderable', 
                         'atlasAdmin.directives.focus',
                         'atlasAdmin.directives.activePath',
                         'atlasAdmin.directives.validUsage',
                         'atlasAdmin.directives.inputmorph',
                         'atlasAdmin.directives.loadContent',
                         'atlasAdmin.directives.bbcscrubbables',
                         'atlasAdmin.controllers.auth',
                         'atlasAdmin.controllers.atlas',
                         'atlasAdmin.controllers.errors',
                         'atlasAdmin.controllers.applications',
                         'atlasAdmin.controllers.wishlist',
                         'atlasAdmin.controllers.sources',
                         'atlasAdmin.controllers.epgwidget',
                         'atlasAdmin.controllers.requestSource',
                         'atlasAdmin.controllers.sourceRequests',
                         'atlasAdmin.controllers.user',
                         'atlasAdmin.controllers.feeds',
                         'atlasAdmin.controllers.uservideosources',
                         'atlasAdmin.controllers.uservideosources.youtube',
                         'atlasAdmin.controllers.bbcscrubbables',
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

    // grouped routes
    $routeProvider.when('/epg/bt-tv', {templateUrl: 'partials/epgWidget.html', controller: 'CtrlEPGWidget'});
    $routeProvider.when('/scrubbables', {templateUrl: 'partials/bbcScrubbables/create.html', controller: 'CtrlBBCScrubbables'});
    $routeProvider.when('/scrubbables/:atlasId', {templateUrl: 'partials/bbcScrubbables/create.html', controller: 'CtrlBBCScrubbables'});

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
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
    $httpProvider.interceptors.push('LoadingInterceptor');
    $httpProvider.interceptors.push('ProfileCompleteInterceptor');
}]);

// This is used for telling angular to allow transposing of strings
// to make url's in the $scope
app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.metabroadcast.com/**'
        ]);
}]);

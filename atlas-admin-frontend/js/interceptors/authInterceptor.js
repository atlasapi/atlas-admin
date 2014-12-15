var app = angular.module('atlasAdmin');

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
    $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', '$timeout', '$location',
        function($q, $rootScope, $injector, $timeout, $location) {
        var requests = 0;
        var loadTimer;
        var restrictedLocations = ['scrubbables'];

        if (!$rootScope.show) {
            $rootScope.show = {};
        }

        var restricted = function() {
            var _path = $location.path();
            for (var i in restrictedLocations) {
                if (_path.indexOf(restrictedLocations[i]) > -1) return true;
            }
            return false;
        }

        var startLoading = function() {
            var _loggedin = $rootScope.status.loggedIn || false;
            if (requests > 1 && _loggedin && !restricted()) {
                $timeout.cancel(loadTimer);
                loadTimer = $timeout(function() {
                    $rootScope.show.load = true;
                    $rootScope.$broadcast('loading-started');
                }, 400);
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

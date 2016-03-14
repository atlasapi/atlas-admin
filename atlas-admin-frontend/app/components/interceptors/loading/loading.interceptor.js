'use strict';

angular.module('atlasAdmin.interceptors.loading')
  .factory('LoadingInterceptor', ['$q', '$rootScope', '$injector', '$timeout', '$location',
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
                if (_path.indexOf(restrictedLocations[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }

        var startLoading = function() {
            var _loggedin = $rootScope.status.loggedIn || false;
            if (requests > 1 && _loggedin && !restricted()) {
                $timeout.cancel(loadTimer);
                $rootScope.show.cloak = true;
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
            $rootScope.show.cloak = false;
        }

        // precautionary incase the loading process is
        // still running from the last page
        endLoading();
        $rootScope.show.cloak = true;

        return {
            'request': function(config) {
                requests++;
                startLoading();
                return config || $q.when(config);
            },
            'response': function(response) {
                requests = (requests > 0)? --requests : 0;
                if (!requests) endLoading();
                return response || $q.when(response);
            }
        };
    }]);

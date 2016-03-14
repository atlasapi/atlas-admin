'use strict';

angular.module('atlasAdmin.interceptors.profileComplete')
  .factory('ProfileCompleteInterceptor', ['ProfileStatus', '$location', '$q', '$rootScope', 'Authentication',
    function (ProfileStatus, $location, $q, $rootScope, Auth) {
    return {
        'request': function(config) {
            var _url = config.url;
            var _provider = Auth.getProvider() || null;
            var _token = Auth.getToken() || null;

            // some paths are just for use by the application; we don't want
            // those to be included in redirects etc
            var allowedRoute = function () {
                return (_url.indexOf('/auth') === -1 &&
                        _url.indexOf('/logout') === -1 &&
                        _url.indexOf('/login') === -1 &&
                        _url.indexOf('/profile') === -1);
            }

            if (_provider && _token) {
                if (!ProfileStatus.isProfileComplete() &&
                    allowedRoute()) {
                        $location.path('/profile');
                }
                if (ProfileStatus.getLicenseAccepted() === false &&
                    allowedRoute()) {
                    $location.path('/terms');
                }
            }
            return config || $q.reject(config);
        },
        'response': function(response) {
            return response || $q.reject(response);
        }
    }
}]);

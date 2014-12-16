var app = angular.module('atlasAdmin.interceptors', []);

app.factory('AuthenticationInterceptor', function ($q, $location, $window, atlasHost, $log, $timeout, $rootScope) {
    return function (promise) {
        return promise.then(
            function (response) {
                 // Set up auto logout after one year. Cancel any existing instance.
                 if ($rootScope.autologout) {
                     $timeout.cancel($rootScope.autologout);
                 }
                 $rootScope.autologout = $timeout(function () {
                     $location.path('/logout');
                 }, 525000 * 60 * 1000);
                 return response;
            },
            function (response) {
                // if no auth token then need to make an access request to atlas
                if (response.config.url.indexOf(atlasHost) !== -1 && response.status === 400) {
                    $log.info('Not logged in');
                    $location.path('/login');
                }
                if (response.config.url.indexOf(atlasHost) !== -1 && response.status === 403) {
                    $window.location.href = '#/error?type=forbidden';
                }
                return $q.reject(response);
            }
        )
    }
})

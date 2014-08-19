'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.auth', []);

app.factory('Authentication', function ($rootScope, ProfileStatus) {
    if (!$rootScope.status) {
        $rootScope.status = {};
    }
    return {
        getProvider: function () {
            return localStorage.getItem('auth.provider');
        },
        setProvider: function (provider) {
            localStorage.setItem('auth.provider', provider);
        },
        getToken: function () {
            return localStorage.getItem('auth.token');
        },
        setToken: function (token) {
            localStorage.setItem('auth.token', token);
        },
        reset: function () {
            localStorage.removeItem('auth.provider');
            localStorage.removeItem('auth.token');
            ProfileStatus.setComplete(false);
            $rootScope.status.loggedIn = false;
        },
        appendTokenToUrl: function (url) {
            var provider = localStorage.getItem('auth.provider');
            var token = localStorage.getItem('auth.token');
            var oauthParams = 'oauth_provider=' + provider + '&oauth_token=' + token;

            if (!token) {
                return url;
            }

            $rootScope.status.loggedIn = true;

            if (url.indexOf('?') !== -1) {
                return url + '&' + oauthParams;
            }
            else {
                return url + '?' + oauthParams;
            }
        }
    };
});

app.factory('AuthenticationInterceptor', function ($q, $location, $window, atlasHost, $log, $timeout, $rootScope) {
    return function (promise) {
        return promise.then(
            function (response) {
                 // Set up auto logout after 20 mins. Cancel any existing instance.
                 if ($rootScope.autologout) {
                     $timeout.cancel($rootScope.autologout);
                 }
                 $rootScope.autologout = $timeout(function () {
                     $location.path('/logout');
                 }, 20 * 60 * 1000);
                 return response;
            },
            function (response) {
                // if no auth token then need to make an access request to atlas
                if (response.config.url.indexOf(atlasHost) !== -1 && response.status === 400) {
                    $log.info('Not logged in');
                    $location.path('/login');
                }
                if (response.config.url.indexOf(atlasHost) !== -1 && response.status === 403) {
                    console.log(atlasHost)
                    //$window.location.href = '#/error?type=forbidden';
                }
                return $q.reject(response);
            }
        );
    };
});

// Make sure profile is completed before allowing use of app
app.factory('ProfileCompleteInterceptor', function (ProfileStatus, $location, $q, $rootScope) {
    return function (promise) {
        return promise.then(
            function (response) {
                var url = response.config.url;

                if (url.indexOf('partials/error') !== -1) {
                    return response;
                }

                if (ProfileStatus.isProfileComplete() ||
                    response.status === 400 ||
                    response.config.url.indexOf('/auth/') !== -1) {
                    return response;
                }

                if (url.indexOf('partials/request') !== -1 ||
                    url.indexOf('partials/source') !== -1 ||
                    url.indexOf('partials/application') !== -1) {

                    if (!ProfileStatus.isProfileComplete()) {
                        $location.path('/terms');
                        return $q.reject(response);
                    }
                }

                return response;
            },
            function (response) {
                return response;
            }
        );
    };
});


var app = angular.module('atlasAdmin.interceptors', []);

app.factory('AuthenticationInterceptor', ['$q', '$location', 'atlasHost', 'atlasApiHost', '$window', 'Authentication',
    function($q, $location, atlasHost, atlasApiHost, $window, Auth) {
    return {
        'request': function(config) {
            var _url = config.url;
            if (_url.indexOf('partials') !== -1 ||
                _url.indexOf('/login') !== -1 ||
                _url.indexOf('/logout') !== -1 ||
                _url.indexOf('/auth/') !== -1) {
                return config || $q.defer(config);
            }
            var _provider = Auth.getProvider() || null;
            var _token = Auth.getToken() || null;
            if (!_token || !_provider) {
                console.log('Token and provider aren\'t present in localstorage');
                $location.path('/login');
            }
            return config || $q.defer(config);
        },

        'responseError': function(response) {
            var _url = response.config.url;
            if (_url.indexOf(atlasHost) !== -1 || _url.indexOf(atlasApiHost) !== -1) {
                if (response.status === 400) {
                    console.error('Account not authenticated to make request to: '+_url);
                    $location.path('/login');
                }else if (response.status === 403) {
                    console.error('You do not have access to the resource ' + _url);
                }
            }
            return response || $q.defer(response);
        } 
    }
}]);
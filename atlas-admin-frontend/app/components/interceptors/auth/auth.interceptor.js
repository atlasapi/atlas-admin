'use strict';

angular
  .module('atlasAdmin.interceptors.auth')
  .factory('AuthenticationInterceptor', AuthenticationInterceptor);

AuthenticationInterceptor.$inject = ['$q', '$location', 'atlasHost', 'atlasApiHost', '$window', 'Authentication', '$log'];

function AuthenticationInterceptor($q, $location, atlasHost, atlasApiHost, $window, Auth, $log, $rootScope, $scope) {
  return {
    request: function(config) {
      $log.info('config', config);
      // $location.path('/login');
      return config || $q.defer(config);
    },

    responseError: function(response) {
      var _url = _.has(response.config, 'url') ? response.config.url : null;

      if (! _url) {
        console.warn('Cannot find url property in response', response.config);
        return;
      }

      if (_url.indexOf(atlasHost) !== -1 || _url.indexOf(atlasApiHost) !== -1) {
        if (response.status === 400) {
          console.error('Account not authenticated to make request to: '+_url);
        } else if (response.status === 403) {
          console.error('You do not have access to the resource ' + _url);
        }
      }

      return response || $q.defer(response);
    }
  };
}

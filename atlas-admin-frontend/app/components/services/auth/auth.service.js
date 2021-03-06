'use strict';
angular.module('atlasAdmin.services.auth')
  .factory('Authentication', ['$rootScope', 'ProfileStatus',
      function ($rootScope, ProfileStatus) {
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
              localStorage.removeItem('profile.complete');
              localStorage.removeItem('license.accepted');
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
              return (url.indexOf('?') === -1) ?
                          url + '?' + oauthParams :
                          url + '&' + oauthParams;
          }
      };
  }]);

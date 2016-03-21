'use strict';

angular
  .module('atlasAdmin.services.atlas', ['ngCookies'])
  .factory('Atlas', Atlas);

function Atlas($http, atlasHost, atlasVersion, Authentication, $log, $cookies) {
  var httpOptions = {
    headers: {
      iPlanetDirectoryPro: $cookies.get('iPlanetDirectoryPro')
    }
  };

  return {
    getRequest: function(url) {
      return $http.get(url, httpOptions);
    },

    getUrl: function (url) {
      return Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url);
    },

    postRequest: function(url, data) {
      return $http.post(url, data, httpOptions);
    },

    deleteRequest: function(url) {
      return $http.delete(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url));
    },

    getAuthProviders: function() {
      return $http.get(atlasHost + "/" + atlasVersion + "/auth/providers.json").then(function(results) {
        return results.data.auth_providers;
      }, function(error) {
        $log.error(error);
      });
    },

    startOauthAuthentication: function(provider, callbackUrl, targetUri) {
      var url = atlasHost + provider.authRequestUrl + ".json?callbackUrl=" + callbackUrl;

      Authentication.setProvider(provider.namespace);

      return $http.get(url).then(function(result) {
        return result.data.oauth_request.login_url;
      }, function(error) {
        console.error(error);
        return error;
      });
    },

    getAccessToken: function(oauth_token, oauth_verifier, code) {
      var url = "/auth/" + Authentication.getProvider() + "/token.json?oauthToken=" + oauth_token + "&oauthVerifier=" + oauth_verifier + "&code=" + code;
      return $http.get(atlasHost + "/" + atlasVersion +  url);
    },

    startLogout: function() {
      return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + "/auth/logout.json"));
    }
  };
}

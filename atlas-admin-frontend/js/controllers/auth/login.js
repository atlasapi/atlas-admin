'use strict';

var app = angular.module('atlasAdmin.controllers.auth');

app.controller('CtrlLogin', function($scope, $rootScope, $rootElement, $routeParams, Atlas, atlasVersion, $location, Authentication, $log, userUrl) {
  $scope.title = "Hi there, please sign in to continue";

  if (Cookies.get('iPlanetDirectoryPro')) {
    var options = {
      url: userUrl,
      headers: {
        iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
      }
    }

    userMigration.isUserLoggedIn(options, function (response) {
      if (!response) {
        return;
      }

      Authentication.reset();

      localStorage.setItem('auth.provider', 'mbst');
      localStorage.setItem('auth.token', Cookies.get('iPlanetDirectoryPro'));
    });

    return;
  }

  // Ask atlas for access here
  Authentication.reset();

  Atlas.getAuthProviders().then(function(results) {
    var providers = [];

    results.forEach(function(provider) {
      provider.icon = (provider.namespace === 'google') ? 'google-plus' : provider.namespace;
      providers.push(provider);
    });

    $scope.providers = providers;

    $scope.referer = window.location.href.split('#')[0];

    if ($routeParams.providerNamespace) {
      $rootScope.startAuth($scope.providers.filter(function(provider) {
        return provider.namespace === $routeParams.providerNamespace;
      })[0]);
    }
  });

  $rootScope.startAuth = function(provider) {
    var uri;
    var target;

    if (provider.redirect) {
      window.location.href = provider.authRequestUrl;
    }

    if ($location.absUrl().indexOf('/login/' + provider.namespace) !== -1) {
      uri = $location.absUrl().replace("/login/" + provider.namespace,"/oauth/" + provider.namespace);
      target = $location.absUrl().replace("/login/" + provider.namespace,"/");
    } else {
      uri = $location.absUrl().replace("/login", "/oauth/" + provider.namespace);
      target = $location.absUrl().replace("/login","/");
    }

    var callbackUrl = encodeURIComponent(uri);
    var targetUri = encodeURIComponent(target);

    Authentication.setProvider(provider.namespace);
    Atlas.startOauthAuthentication(provider, callbackUrl, targetUri).then(function(login_url) {
      window.location.href = login_url;
    }, function(error) {
      $log.error("Error starting auth:");
      $log.error(error);
    });
  };
});

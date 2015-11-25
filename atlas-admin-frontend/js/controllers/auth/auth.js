'use strict';
var app = angular.module('atlasAdmin.controllers.auth', []);

// User migration code
var userCookie = Cookies.get('iPlanetDirectoryPro');

var isUserLoggedIn = function (user) {
  $.ajax({
    url: 'http://admin-backend-stage.metabroadcast.com/1/user',
    headers: {
      iPlanetDirectoryPro: userCookie
    },
    success: function (response) {
      findUserApplications(response, user);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(textStatus, errorThrown);
    }
  });
};

var findUserApplications = function (newUserData, originalUserData) {
  var applications = originalUserData.applications;
  applications.forEach(function (application) {
    createGroupForApplication(application);
  });
  // deactivateUser(user);
};

var createGroupForApplication = function (applicationId) {
  $.ajax({
    method: 'POST',
    url: 'http://admin-backend-stage.metabroadcast.com/1/groups',
    headers: {
      iPlanetDirectoryPro: userCookie
    },
    data: {
      application_name: applicationId,
      uniqueUser: 'id=steve@metabroadcast.com,ou=user,dc=metabroadcast,dc=com',
      realm: '/'
    },
    success: function (response) {
      console.log('response', response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(textStatus, errorThrown);
    }
  });
};

var deactivateUser = function (user) {
  $.ajax({
    url: 'http://stage.atlas.metabroadcast.com/4/users/deactivate/' + user.id,
    method: 'POST',
    success: function (response) {
      console.log('response');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(textStatus, errorThrown);
    }
  });
};

app.controller('CtrlOAuth', function($scope, $rootScope, $routeParams, $location, Authentication, Atlas, $log, Users) {
    if (window.location.search.indexOf("code") == -1 &&  window.location.search.indexOf("oauth") == -1) {
        // search part will be empty if we have been here and cleared the oauth replies
        // In this case redirect.
        $location.path("/applications");
        return;
    }

    $rootScope.title = "Signing in...";
    Authentication.setProvider($routeParams.providerNamespace);

    var oauth_token = "";
    var oauth_verifier = "";
    var code = "";
    var searchParts = window.location.search.replace("?","").split("&");

    for (var i in searchParts) {
        var parts = searchParts[i].split("=");
        if (parts[0] == "oauth_token") {
           oauth_token = parts[1];
        } else if (parts[0] == "oauth_verifier") {
           oauth_verifier = parts[1];
        } else if (parts[0] == "code") {
           code = parts[1];
        }
    }

    Atlas.getAccessToken(oauth_token, oauth_verifier, code)
        .then(function(results) {
        if (!results.data.oauth_result) {
            return;
        }
        Authentication.setToken(results.data.oauth_result.access_token);
        var redirectToSources = function() {
            window.location.search = "";
        };
        Users.currentUser(function (user) {
            isUserLoggedIn(user);
            redirectToSources();
        });
    },

    function(error) {
        $log.error("Error getting access token.");
        $log.error(error);
        $location.hash("/login");
    });
});

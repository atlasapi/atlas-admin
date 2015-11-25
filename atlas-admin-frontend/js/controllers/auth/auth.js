'use strict';
var app = angular.module('atlasAdmin.controllers.auth', []);
var userCookie = Cookies.get('iPlanetDirectoryPro');

var UserMigration = {
  isUserLoggedIn: function (user) {
    $.ajax({
      url: 'http://admin-backend-stage.metabroadcast.com/1/user',
      headers: {
        iPlanetDirectoryPro: userCookie
      },
      success: function () {
        UserMigration.findUserApplications(response, user);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
      }
    });
  },

  findUserApplications: function (newUserData, originalUserData) {
    console.log('newUserData', newUserData);
    var applications = originalUserData.applications;
    var uniqueUser = 'id=' + newUserData.dn.uid;
    uniqueUser += ',ou=' + newUserData.dn.ou;
    uniqueUser += ',dc=' + newUserData.dn.dc[0];
    uniqueUser += ',dc=' + newUserData.dn.dc[1];
    applications.forEach(function (application) {
      UserMigration.createGroupForApplication(application, uniqueUser);
    });
    // UserMigration.deactivateUser(user);
  },

  createGroupForApplication: function (applicationId, uniqueUser) {
    $.ajax({
      method: 'POST',
      url: 'http://admin-backend-stage.metabroadcast.com/1/groups',
      headers: {
        iPlanetDirectoryPro: userCookie
      },
      data: {
        application_name: applicationId,
        uniqueUser: uniqueUser,
        realm: '/'
      },
      success: function (response) {
        console.log('response', response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
      }
    });
  },

  deactivateUser: function (user) {
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
  }
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
            UserMigration.isUserLoggedIn(user);
            redirectToSources();
        });
    },

    function(error) {
        $log.error("Error getting access token.");
        $log.error(error);
        $location.hash("/login");
    });
});

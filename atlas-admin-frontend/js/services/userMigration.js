'use strict';

var userCookie = Cookies.get('iPlanetDirectoryPro');

var UserMigration = {
  isUserLoggedIn: function (user) {
    $.ajax({
      url: 'http://admin-backend-stage.metabroadcast.com/1/user',
      headers: {
        iPlanetDirectoryPro: userCookie
      },
      success: function (response) {
        UserMigration.findUserApplications(response, user);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
      }
    });
  },

  findUserApplications: function (newUserData, originalUserData) {
    var oauthToken = localStorage.getItem('auth.token');
    var oauthProvider = localStorage.getItem('auth.provider');
    var oauthString = '?oauth_token=' + oauthToken + '&oauth_provider=' + oauthProvider;
    var applications = originalUserData.applications;
    var uniqueUser = 'id=' + newUserData.attributes.dn.uid;
    uniqueUser += ',ou=' + newUserData.attributes.dn.ou;
    uniqueUser += ',dc=' + newUserData.attributes.dn.dc[0];
    uniqueUser += ',dc=' + newUserData.attributes.dn.dc[1];
    applications.forEach(function (applicationId) {
      $.ajax({
        url: 'https://atlas.metabroadcast.com/4/applications/' + applicationId + '.json' + oauthString,
        success: function (response) {
          UserMigration.createGroupForApplication(application);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(textStatus, errorThrown);
        }
      });
    });
    // UserMigration.deactivateUser(user);
  },

  createGroupForApplication: function (application) {
    $.ajax({
      method: 'POST',
      url: 'http://admin-backend-stage.metabroadcast.com/1/applications',
      headers: {
        iPlanetDirectoryPro: userCookie
      },
      data: application,
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

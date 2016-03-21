'use strict';

angular
  .module('atlasAdmin.services.applications')
  .factory('Applications', Applications);

function Applications(Atlas) {
  return {
    all: function() {
      return Atlas
        .getRequest('/applications.json')
        .then(function(results) {
          return results.data.applications;
      });
    },

    get: function(applicationId) {
      return Atlas
        .getRequest('http://admin-backend.metabroadcast.com/1/applications/' + applicationId)
        .then(function(results) {
          return results.data.application;
      });
    },

    create: function(title, description, url) {
      var data = {
        title: title,
        description: description,
        publisher: {
          key: 'metabroadcast.com',
          name: 'MetaBroadcast',
          country: 'ALL'
        }
      };

      return Atlas
        .postRequest('http://admin-backend.metabroadcast.com/1/applications', data);
    },

    update: function(data, callback) {
      return Atlas.postRequest('/applications.json', data);
    },

    setPrecedence: function(applicationId, sourceIdOrder) {
      var url = '/applications/' + applicationId + '/precedence';
      var data = { 'ordering': sourceIdOrder };
      return Atlas.postRequest(url, data);
    },

    deletePrecedence:  function(applicationId) {
      var url = '/applications/' + applicationId + '/precedence';
      return Atlas.deleteRequest(url);
    },

    revokeApplication: function(data) {
      data.revoked = true;
      return Atlas
        .postRequest('/applications.json', data)
        .then(function(results) {
          return results.data.data;
      });
    },

    unRevokeApplication: function(application) {
      application.revoked = false;
      return Atlas
        .postRequest('/applications.json', application)
        .then(function(results) {
          return results.data.application;
      });
    }
  };
}

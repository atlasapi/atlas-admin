'use strict';

angular
  .module('atlasAdmin.services.sources')
  .factory('Sources', Sources);

function Sources(Atlas, Applications, $log) {
  return {
    all: function () {
      return Atlas
        .getRequest('http://admin-backend.metabroadcast.com/1/applications//sources')
        .then(function(result) {
          return result.data.sources;
      });
    },

    get: function (sourceId) {
      return Atlas
        .getRequest('http://admin-backend.metabroadcast.com/1/sources/' + sourceId)
        .then(function(result) {
          return result.data.source;
      });
    },

    changeAppState: function(sourceId, appId, state, callback) {
      var data = {};
      var url = "/sources/" + sourceId + "/applications/readers/" + appId + "/state?state="+ state;

      Atlas
        .postRequest(url, data, { withCredentials: false })
        .success(callback)
        .error(function(error) {
          $log.error(error)
      });
    },

    addWriter: function(sourceId, appId, callback) {
      var url = "/sources/" + sourceId + "/applications?id=" + appId + "&permission=write";

      Atlas
        .postRequest(url, {}, { withCredentials: false })
        .success(callback);
    }
  }
}

'use strict';

angular.module('atlasAdmin.services.sourceRequests')
  .factory('sourceRequests', ['$http', 'Authentication', 'atlasApiHost', 'Atlas', 'Users', '$q',
    function ($http, Authentication, atlasApiHost, Atlas, Users, $q) {
      var endpoint = atlasApiHost + '/requests';

      return {
          all: function() {
              return Atlas.getRequest('/requests.json').then(function (results) {
                  return results.data.source_requests});
          },
          send: function(sourceId, applicationId, applicationUrl, reason, usageType, licenseAccepted) {
              var url = "/sources/" + sourceId + "/requests?"
                   + "appId=" + applicationId
                   + "&appUrl=" + encodeURIComponent(applicationUrl)
                   + "&reason=" + encodeURIComponent(reason)
                   + "&usageType=" + usageType
                   + "&licenseAccepted=" + licenseAccepted;
              return Atlas.postRequest(url, {});
          },
          approve: function(requestId) {
              var url = '/requests/' + requestId + '/approve';
              return Atlas.postRequest(url, {});
          },
          postRequest: function(data) {
              var defer = $q.defer();
              $http({
                  method: 'post',
                  url: Authentication.appendTokenToUrl(endpoint),
                  data: data
              })
              .success(function(data, status) {
                  defer.resolve(status);
              })
              return defer.promise;
          },
          getUnapprovedRequests: function() {
              var defer = $q.defer();
              $http({
                  method: 'get',
                  url: Authentication.appendTokenToUrl(endpoint)
              })
              .success(function(data) {
                  defer.resolve(data)
              })
              return defer.promise;
          },
          putChangeRequest: function(data) {
              var defer = $q.defer();
              $http({
                  method: 'put',
                  url: Authentication.appendTokenToUrl(endpoint),
                  data: data
              })
              .success(function(status) {
                  defer.resolve(status);
              });
              return defer.promise;
          }
        }
    }]);

angular.module('atlasAdmin.services.sourceLicenses')
  .factory('SourceLicenses', function (Atlas, Users) {
      return {
          get: function(sourceId) {
            return Atlas.getRequest('/source_licenses/' + sourceId + '.json').then(
            function (results) {
              return results.data.source_license
            });
          }
      }
  });

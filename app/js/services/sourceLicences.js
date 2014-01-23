var app = angular.module('atlasAdmin.services.sourceLicences', []);
app.factory('SourceLicences', function (Atlas, Users) {
    return {
        get: function(sourceId) {
            return Atlas.getRequest('/source_licences/' + sourceId + '.json').then(function (results) {
                return results.data.source_licence});
        }
    }
});
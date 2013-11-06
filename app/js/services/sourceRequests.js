var app = angular.module('atlasAdmin.services.sourceRequests', []);
app.factory('SourceRequests', function (Atlas, Users) {
    return {
        all: function() {
            return Atlas.getRequest('/requests.json').then(function (results) {
                return results.data.source_requests});
        },
        send: function(sourceId, applicationId, applicationUrl, reason, usageType) {
            var url = "/sources/" + sourceId + "/requests?" 
                 + "appId=" + applicationId
                 + "&appUrl=" + encodeURIComponent(applicationUrl)
                 + "&reason=" + encodeURIComponent(reason)
                 + "&usageType=" + usageType;
            return Atlas.postRequest(url, {});
        },
        approve: function(requestId) {
            var url = '/requests/' + requestId + '/approve';
            return Atlas.postRequest(url, {});
        }
    }
});
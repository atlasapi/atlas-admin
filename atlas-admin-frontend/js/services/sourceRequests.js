var app = angular.module('atlasAdmin.services.sourceRequests', []);
app.factory('SourceRequests', function (Atlas, Users) {
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
        }
    }
});

app.factory('SourcePayment', function() {
    var plans = function() {
        return [{
            users: '1 to 10',
            price: 'Free'
        },
        {
            users: '11 to 1000',
            price: '£95'
        },
        {
            users: '1,001 to 10,000',
            price: '£245'
        },
        {
            users: '10,001 to 50,000',
            price: '£995'
        }];
    }

    return plans;
});
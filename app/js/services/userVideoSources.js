var app = angular.module('atlasAdmin.services.uservideosources', []);
app.factory('UserVideoSources', function (Atlas, atlasVersion, Applications) {
    return {
        allProviders: function() {
            return Atlas.getRequest('/videosource/providers.json').then(function (results) {
                return results.data.link_providers});
        },
        getOAuthLogin: function(authUrl, callbackUrl) {
            var url = authUrl.replace("/" + atlasVersion, "") + ".json?redirectUri=" + encodeURIComponent(callbackUrl);
            return Atlas.getRequest(url).then(function (results) {
                return results.data.oauth_request});
        },
        getAllWritableSources: function() {
             return Applications.all().then(function(applications) {
                 // Extract writable sources from apps that give user write permission
                 var writable = {};
                 for (var i in applications) {
                     for (var j in applications[i].sources.writes) {
                         var source = applications[i].sources.writes[j];
                         writable[source.id] = source;
                     }
                 }
                 return writable;
             });
        },
    }
});
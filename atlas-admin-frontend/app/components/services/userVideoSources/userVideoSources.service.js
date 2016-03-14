'use strict';
angular.module('atlasAdmin.services.uservideosources')
  .factory('UserVideoSources', ['Atlas', 'atlasVersion', 'Applications',
    function (Atlas, atlasVersion, Applications) {
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
        getChannels: function() {
            return Atlas.getRequest('/videosource/youtube/channels.json').then(function (results) {
                return results.data.user});
        },
        addPublisher: function(youTubeId, sourceId) {
            var url = '/videosource/youtube/' + youTubeId + '/source/add/' + sourceId + '.json';
            return Atlas.postRequest(url, {});
        },
        addChannel: function(youTubeId, channelId) {
            var url = '/videosource/youtube/' + youTubeId + '/channels/add/' + channelId + '.json';
            return Atlas.postRequest(url, {});
        }
      }
    }]);

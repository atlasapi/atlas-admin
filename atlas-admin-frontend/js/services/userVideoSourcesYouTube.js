var app = angular.module('atlasAdmin.services.uservideosources.youtube', []);

app.factory('UserVideoSourcesYouTube', function (Atlas) {
    return {
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
});
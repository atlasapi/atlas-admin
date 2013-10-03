'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
 .factory('Sources', function ($http, atlasHost, Applications) {
    return {
        all: function () {
             return $http.get(atlasHost + '/sources.json').then(function(result) {return result.data.sources;});
        },
        get: function (sourceId) {
             return $http.get(atlasHost + '/sources/' + sourceId + '.json').then(function(result) {return result.data.source;});
        },
        changeAppState: function(sourceId, appId, state, callback) {
            var data = {};
            var url = atlasHost + "/sources/" + sourceId + "/applications/readers/" + appId + "/state?state="+ state;
            $http.post(url, data, {withCredentials: false}).success(callback);//.error(function(error) {console.log(error)});
        },
        addWriter: function(sourceId, appId, callback) {
            var url = atlasHost + "/sources/" + sourceId + "/applications?id=" + appId + "&permission=write";
            $http.post(url, {}, {withCredentials: false}).success(callback);
        }
    }
 })
.factory('Applications', function ($http, atlasHost) {
    return {
        all: function () {
            return $http.get(atlasHost + '/applications.json').then(function (results) {return results.data.applications});
        },
        get: function(applicationId) {
            return $http.get(atlasHost + '/applications/' + applicationId + '.json').then(function (results) {return results.data.application});   
        },
        create: function(title) {
            var url = atlasHost + "/applications.json";
            var application = {
                 "title": title,
                 "description":"",
                 "publisher": {"key":"metabroadcast.com", "name":"MetaBroadcast","country":"ALL"}
            }
            return $http.post(url, application, {withCredentials: false});
        },
        update: function(application, callback) {
            var url = atlasHost + "/applications.json";
            return $http.post(url, application, {withCredentials: false});
        },
        setPrecedence: function(applicationId, sourceIdOrder) {
            var url = atlasHost + "/applications/" + applicationId + "/precedence";
            var data = {"ordering":sourceIdOrder};
            return $http.post(url, data, {withCredentials: false});
        },
        deletePrecedence:  function(applicationId) {
            var url = atlasHost + "/applications/" + applicationId + "/precedence";
            return $http.delete(url);
        }
        
    }
 })
.factory('SourceRequests', function ($http, atlasHost) {
    return {
        all: function() {
            return $http.get(atlasHost + '/requests.json').then(function (results) {
                return results.data.source_requests});
        },
        send: function(sourceId, applicationId, applicationUrl, email, reason, usageType) {
            var url = atlasHost + "/sources/" + sourceId + "/requests?" 
                 + "appId=" + applicationId
                 + "&appUrl=" + encodeURIComponent(applicationUrl)
                 + "&email=" + encodeURIComponent(email)
                 + "&reason=" + encodeURIComponent(reason)
                 + "&usageType=" + usageType;
            return $http.post(url, {});
        },
        approve: function(requestId) {
            var url = atlasHost + '/requests/' + requestId + '/approve';
            return $http.post(url, {}, {withCredentials: false});
        }
    }
});
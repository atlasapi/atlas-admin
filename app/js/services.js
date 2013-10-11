'use strict';

/* Services */
angular.module('atlasAdmin.services', [])
 .factory('Sources', function (Atlas, Applications) {
    return {
        all: function () {
             return Atlas.getRequest('/sources.json').then(function(result) {return result.data.sources;});
        },
        get: function (sourceId) {
             return Atlas.getRequest('/sources/' + sourceId + '.json').then(function(result) {return result.data.source;});
        },
        changeAppState: function(sourceId, appId, state, callback) {
            var data = {};
            var url = "/sources/" + sourceId + "/applications/readers/" + appId + "/state?state="+ state;
            Atlas.postRequest(url, data, {withCredentials: false}).success(callback);//.error(function(error) {console.log(error)});
        },
        addWriter: function(sourceId, appId, callback) {
            var url = "/sources/" + sourceId + "/applications?id=" + appId + "&permission=write";
            Atlas.postRequest(url, {}, {withCredentials: false}).success(callback);
        }
    }
 })
.factory('Applications', function (Atlas) {
    return {
        all: function () {
            return Atlas.getRequest('/applications.json').then(function (results) {return results.data.applications});
        },
        get: function(applicationId) {
            return Atlas.getRequest('/applications/' + applicationId + '.json').then(function (results) {return results.data.application});   
        },
        create: function(title) {
            var application = {
                 "title": title,
                 "description":"",
                 "publisher": {"key":"metabroadcast.com", "name":"MetaBroadcast","country":"ALL"}
            }
            return Atlas.postRequest("/applications.json", application);
        },
        update: function(application, callback) {
            return Atlas.postRequest("/applications.json", application);
        },
        setPrecedence: function(applicationId, sourceIdOrder) {
            var url = "/applications/" + applicationId + "/precedence";
            var data = {"ordering":sourceIdOrder};
            return Atlas.postRequest(url, data);
        },
        deletePrecedence:  function(applicationId) {
            var url = "/applications/" + applicationId + "/precedence";
            return Atlas.deleteRequest(url);
        }
        
    }
 })
.factory('SourceRequests', function (Atlas) {
    return {
        all: function() {
            return Atlas.getRequest('/requests.json').then(function (results) {
                return results.data.source_requests});
        },
        send: function(sourceId, applicationId, applicationUrl, email, reason, usageType) {
            var url = "/sources/" + sourceId + "/requests?" 
                 + "appId=" + applicationId
                 + "&appUrl=" + encodeURIComponent(applicationUrl)
                 + "&email=" + encodeURIComponent(email)
                 + "&reason=" + encodeURIComponent(reason)
                 + "&usageType=" + usageType;
            return Atlas.postRequest(url, {});
        },
        approve: function(requestId) {
            var url = '/requests/' + requestId + '/approve';
            return Atlas.postRequest(url, {});
        }
    }
})
.factory('Atlas', function ($http, atlasHost) {
    return {
       getRequest: function(url) {
           return $http.get(atlasHost + url);   
       },
       postRequest: function(url, data) {
           return $http.post(atlasHost + url, data, {withCredentials: false});   
       },
       deleteRequest: function(url) {
           return $http.delete(atlasHost + url);
       }
    }
});
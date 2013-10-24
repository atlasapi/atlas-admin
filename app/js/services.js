'use strict';

/* Services */
var app = angular.module('atlasAdmin.services', []);
app.factory('Sources', function (Atlas, Applications) {
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
 });
app.factory('Applications', function (Atlas) {
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
 });
app.factory('SourceRequests', function (Atlas) {
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
});
app.factory('Atlas', function ($http, atlasHost, atlasVersion, Authentication) {
    return {
       getRequest: function(url) {
           return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion +  url));   
       },
       postRequest: function(url, data) {
           return $http.post(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url), data, {withCredentials: false});   
       },
       deleteRequest: function(url) {
           return $http.delete(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url));
       },
       getAuthProviders: function() {
           return $http.get(atlasHost + "/" + atlasVersion + "/auth/providers.json").then(function(results){
               var authProviders = [];
               for (var i in results.data.auth_providers) {
                   var provider = results.data.auth_providers[i];
                   provider.image = atlasHost + provider.image;
                   authProviders.push(provider);
               }
               return authProviders;
           }, function(error) {
               console.log(error);   
           });  
       },
       startOauthAuthentication: function(provider, callbackUrl, targetUri) {
          var url = atlasHost + provider.authRequestUrl + ".json?callbackUrl=" + callbackUrl;
          Authentication.setProvider(provider.namespace);
          return $http.get(url).then(function(result) {
              return result.data.oauth_request.login_url;
              
          }, function(error) {
              return error;  
          });
       },
       getAccessToken: function(oauth_token, oauth_verifier) {
           var url = "/auth/" + Authentication.getProvider() + "/token.json?oauthToken=" + oauth_token
                 + "&oauthVerifier=" + oauth_verifier;
           return $http.get(atlasHost + "/" + atlasVersion +  url); 
       }        
    }
});
app.factory('Authentication', function($rootScope) {
    return {
        getProvider: function() {
            return sessionStorage.getItem("auth.provider");   
        },
        setProvider: function(provider) {
            sessionStorage.setItem("auth.provider", provider);
        },
        getToken: function() {
            return sessionStorage.getItem("auth.token");  
        },
        setToken: function(token) {
            sessionStorage.setItem("auth.token", token);   
        },
        reset: function() {
            sessionStorage.removeItem("auth.provider");
            sessionStorage.removeItem("auth.token");   
        },
        appendTokenToUrl: function(url) {
            var provider = sessionStorage.getItem("auth.provider");
            var token = sessionStorage.getItem("auth.token");
            if (!token) {
                return url;
            } 
            var oauthParams = "oauth_provider=" + provider + "&oauth_token=" + token;
            if (url.indexOf("?") != -1) {
                return url + "&" + oauthParams;
            } else {
                return url + "?" + oauthParams;
            }            
        }
    }
});
app.factory('AuthenticationInterceptor', function ($q, $location, atlasHost) {
    return function(promise) {
        return promise.then(
            function(response) {
                 return response;
            }, 
            function(response) {
                // if no auth token then need to make an access request to atlas
                if (response.config.url.indexOf(atlasHost)!= -1 && response.status == 401) {
                    console.log("Not logged in");
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        );     
    }
});


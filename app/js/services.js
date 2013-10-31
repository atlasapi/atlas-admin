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
app.factory('SourceRequests', function (Atlas, Users) {
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
app.factory('Users', function(Atlas, $rootScope, ProfileStatus) {
    return {
        currentUser: function() {
            return Atlas.getRequest('/auth/user.json').then(function(result) { 
                ProfileStatus.setComplete(result.data.user.profile_complete == "true");
                return result.data.user; 
            }); 
        },
        update: function(user, callback) {
            ProfileStatus.setComplete(true);
            return Atlas.postRequest("/users/" + user.id + ".json", user);
        }        
    }    
});
app.factory('ProfileStatus', function() {
    return {
        setComplete: function(status) {
            localStorage.setItem("profile.complete", status ? "true" : "false");   
        },
        isProfileComplete: function() {
            return localStorage.getItem("profile.complete") == "true";
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
               return results.data.auth_providers;
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
       },
       startLogout: function() {
           return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + "/auth/logout.json"));    
       }
    }
});
app.factory('Authentication', function($rootScope, ProfileStatus) {
    if (!$rootScope.status) {
        $rootScope.status = {};
    }
    return {
        getProvider: function() {
            return localStorage.getItem("auth.provider");   
        },
        setProvider: function(provider) {
            localStorage.setItem("auth.provider", provider);
        },
        getToken: function() {
            return localStorage.getItem("auth.token");  
        },
        setToken: function(token) {
            localStorage.setItem("auth.token", token);   
        },
        reset: function() {
            localStorage.removeItem("auth.provider");
            localStorage.removeItem("auth.token"); 
            ProfileStatus.setComplete(false);
            $rootScope.status.loggedIn = false;
        },
        appendTokenToUrl: function(url) {
            var provider = localStorage.getItem("auth.provider");
            var token = localStorage.getItem("auth.token");
            if (!token) {
                return url;
            }
            $rootScope.status.loggedIn = true;
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
// Make sure profile is completed before allowing use of app
app.factory('ProfileCompleteInterceptor', function(ProfileStatus, $location, $q) {
   return function(promise) {
        return promise.then(
            function(response) {
                if (ProfileStatus.isProfileComplete()) {
                    return response;   
                }
                var url = response.config.url;
                
                if (url.indexOf("partials/request") != -1 || url.indexOf("partials/source") != -1 || url.indexOf("partials/application") != -1) {
                    $location.path('/profile');
                    return $q.reject(response);
                } 
                return response;
            }, 
            function(response) {
                return response;
            }
        );     
    } 
    
});


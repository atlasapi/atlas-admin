'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.auth', []);


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
                if (response.config.url.indexOf(atlasHost)!= -1 && response.status == 403) {
                    $location.path('/error?type=forbidden');
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
                
                if (url.indexOf("partials/request") != -1 
                    || url.indexOf("partials/source") != -1 
                    || url.indexOf("partials/application") != -1) {
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

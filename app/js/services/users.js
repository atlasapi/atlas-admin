'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.users', []);

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
        },
        get: function(uid) {
            return Atlas.getRequest('/users/' + uid + '.json').then(function(result) { 
                return result.data.user; 
            }); 
        },
        all: function() {
            return Atlas.getRequest('/users.json').then(function(result) { 
                return result.data.users; 
            }); 
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
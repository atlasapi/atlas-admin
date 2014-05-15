'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.users', []);

app.factory('Users', function(Atlas, $rootScope, ProfileStatus, $log) {
    return {
        currentUser: function() {
            return Atlas.getRequest('/auth/user.json').then(function(result) {
                if (result.data.user) {
                    if (result.data.user.license_accepted && result.data.user.profile_complete === "true") {
                        ProfileStatus.setComplete(true);
                    }
                    return result.data.user;
                }
                $log.error("No user");
                return null;
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
        },
        getTermsAndConditions: function() {
            return Atlas.getRequest('/eula.json').then(function(result) {
                if (result.status > 399) {
                    throw 'NOT_AVAILABLE/'+result.status;
                }
                return result.data.license.license;
            });
        },
        acceptTermsAndConditions: function(uid) {
            return Atlas.postRequest('/users/' + uid + '/eula/accept.json', {}).then(
                function(success) {
                    return success;
                },
                function(error) {
                    $log.error(error);
                }
            );
        }
    };
});
app.factory('ProfileStatus', function() {
    return {
        setComplete: function(status) {
            localStorage.setItem("profile.complete", status ? "true" : "false");
        },
        isProfileComplete: function() {
            return localStorage.getItem("profile.complete") == "true";
        }
    };
});
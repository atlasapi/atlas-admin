angular
  .module('atlasAdmin.services.profileStatus')
  .factory('ProfileStatus', ProfileStatus);

function ProfileStatus() {
  return {
    getLicenseAccepted: function() {
      if (localStorage.getItem("license.accepted")) {
        return localStorage.getItem("license.accepted") == "true";
      } else {
        return null;
      }
    },

    setLicenseAccepted: function(status) {
      return localStorage.setItem("license.accepted", status ? "true" : "false");
    },

    setComplete: function(status) {
      localStorage.setItem("profile.complete", status ? "true" : "false");
    },

    isProfileComplete: function() {
      return localStorage.getItem("profile.complete") == "true";
    }
  };
}

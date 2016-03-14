angular.module('atlasAdmin.terms')
  .controller('UserLicenseController', function($scope, $rootScope, $routeParams, Users, $location, $window, $sce, $log, ProfileStatus) {
      // only try to get user if logged in
      $scope.view_title = 'Atlas Terms and Conditions'
      $scope.app = {};
      Users.currentUser(function(user) {
          $scope.app.user = user;
      });

      var error = function(error) {
          $log.error(error);
          $window.location.href = '/#/error?type=not_available';
      };

      Users.getTermsAndConditions().then(function(license) {
        $scope.app.license = $sce.trustAsHtml(license);
      }, error);

      $scope.app.accept = function() {
          Users.acceptTermsAndConditions($scope.app.user.id).then(function(data) {
              ProfileStatus.setLicenseAccepted(true);
              $location.path('/profile');
          }, error);
      }

      $scope.app.reject = function() {
          $location.path('/logout');
      };
  });

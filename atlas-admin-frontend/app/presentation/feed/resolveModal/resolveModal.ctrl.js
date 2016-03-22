'use strict';

angular.module('atlasAdmin.feed')
  .controller('CtrlFeedsResolveModal', ['$scope', '$uibModalInstance', '$q', 'FeedsService', 'modalAction', '$http', 'atlasHost',
    function($scope, $uibModalInstance, $q, Feeds, modalAction, $http, atlasHost) {
        var pidLength = 8;
        $scope.actionName = modalAction;
        $scope.pidValue = '';
        $scope.showSearchRes = false;

        $scope.convertCrid = function (cridValue) {
          $http.get(atlasHost + '/feeds/nitro-youview/version.json?crid=' + cridValue)
            .success( function (data, status) {
              var pidUri = data.blocklist[0].resolved_as;
              $scope.showSearchRes = true;
              $scope.newPID = pidUri.substr(pidUri.lastIndexOf('/') + 1);
            })
            .error(function (data, status) {
              $scope.resultMessage.body = 'The CRID search could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
            });
        }

        $scope.findPid = function (pidValue) {
          if (pidValue.length !== pidLength) {
            return console.warn('PID isn\'t the correct length');
          }
          var nitroUri = 'http://nitro.bbc.co.uk/programmes/' + pidValue;
          $http.get(atlasHost + '/3.0/content.json?apiKey=cae02bc954cf40809d6d70601d3e0b88&uri=' + nitroUri + '&annotations=description,extended_description,brand_summary')
            .success( function (data, status) {
              $scope.showSearchRes = true;
              var atlasres = data.contents[0];

              if (atlasres) {
                $scope.atlasResult.imageUrl = atlasres.image;
                $scope.atlasResult.title = atlasres.title;
                $scope.atlasResult.brand = atlasres.container.title || '';
                $scope.atlasResult.time = 1;
                $scope.atlasResult.description = trimString(60, atlasres.description);
              }
            })
            .error(function (data, status) {
              $scope.resultMessage.body = 'The PID search could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
            });
        };

        $scope.dismiss = function() {
          $uibModalInstance.dismiss();
        };
      }]);

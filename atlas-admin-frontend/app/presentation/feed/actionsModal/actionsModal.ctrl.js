'use strict';

angular.module('atlasAdmin.feed')
  .controller('CtrlFeedsAcceptModal', ['$scope', '$modalInstance', '$q', 'FeedsService', 'modalAction', '$http', 'atlasHost',
    function($scope, $modalInstance, $q, Feeds, modalAction, $http, atlasHost) {
        var pidLength = 8;
        $scope.actionName = modalAction;
        $scope.pidValue = '';
        $scope.showSearchRes = false;
        $scope.resultMessage = {};
        $scope.clearUI = false;
        $scope.isBusy = false;
        $scope.atlasResult = {  };
        $scope.uiStrings = {
          revoke: 'Revoke',
          upload: 'Publish'
        };

        var trimString = function (wordCount, string) {
          var append = '';
          var words = string.split(' ');

          if (words.length > wordCount) {
            append = '...';
          }
          var truncated = words.slice(0, wordCount).join(' ');
          return truncated + append;
        };

        var runRevoke = function (pid) {
          var payload = {
            uri: 'http://nitro.bbc.co.uk/programmes/' + pid
          };

          $scope.isBusy = true;

          Feeds.request('youview/bbc_nitro/action/revoke', 'post', payload).then(
          function (data, status) {
            if (_.isObject(data)) {
              $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
              $scope.isBusy = false;
              return;
            }
            $scope.showSearchRes = false;
            $scope.atlasResult = {  };
            $scope.resultMessage.body = 'The revoke transaction has been added to the queue';
            $scope.resultMessage.class = 'success';
            $scope.clearUI = true;
            $scope.isBusy = false;
          },
          function () {
            $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
            $scope.resultMessage.class = 'error';
            $scope.isBusy = false;
          });
        };

        var runIngest = function (pid) {
          var payload = {};

          $scope.isBusy = true;

          Feeds.request('forceUpdate/' + pid, 'post', payload).then(
          function (data, status) {
            if (_.isObject(data)) {
              $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
              $scope.isBusy = false;
              return;
            }
            $scope.showSearchRes = false;
            $scope.atlasResult = {  };
            $scope.resultMessage.body = 'The publish transaction has been added to the queue';
            $scope.resultMessage.class = 'success';
            $scope.clearUI = true;
            $scope.isBusy = false;
          },
          function () {
            $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
            $scope.resultMessage.class = 'error';
            $scope.isBusy = false;
          });
        };

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


        $scope.triggerAction = function (actionName, pid) {
          if (! pid) {
            return console.warn('cannot trigger action because there is no pid argument');
          }
          if (! actionName) {
            return console.warn('cannot trigger action because there is no actionName argument');
          }
          switch (actionName) {
            case 'upload': runIngest(pid); break;
            case 'revoke': runRevoke(pid); break;
          }
        };

        $scope.dismiss = function() {
          $modalInstance.dismiss();
        };
      }]);

angular.module('atlasAdmin.actionModal')
  .directive('actionModal', ['$document', '$q', '$modal',
    function($document, $q, $modal) {
      var controller = function($scope, el, attr) {
        var modal = function(action) {
          var defer = $q.defer();

          if (!_.isString(action)) {
            defer.reject();
            return defer.promise;
          }

          var _content = {
            title: '<strong>'+action+'</strong> task?',
            action: action.charAt(0).toUpperCase() + action.slice(1)
          };

          var _modalInstance = $modal.open({
            // template: '<h1>'+_content.title+'</h1></div><div class="feed-modal-options"><button ng-disabled="isSendingAction" ng-click="ok()">'+_content.action+'</button><button ng-click="dismiss()">Cancel</button>',
            templateUrl: 'presentation/feed/actionsModal/actionsModal.tpl.html',
            controller: 'CtrlFeedsAcceptModal',
            windowClass: 'feedsAcceptModal',
            scope: $scope,
            resolve: { modalAction: function() { return action; } }
          });

          _modalInstance.result.then(defer.resolve, defer.reject);
          return defer.promise;
        };

        $(el).on('click', function() {
          if ($scope.task || $scope.tasks) {
            var action = attr.actionModal || null;
            modal(action).then( function() {

            });
          }
        });
      };

      return {
        scope: false,
        link: controller
      };
    }]);

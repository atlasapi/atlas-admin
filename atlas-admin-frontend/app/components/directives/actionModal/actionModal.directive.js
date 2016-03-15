angular.module('atlasAdmin.directives.actionModal')
  .directive('actionModal', ['$document', '$q', '$uibModal',
    function($document, $q, $uibModal) {
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

          if (action === 'resolve') {

            var _modalInstance = $uibModal.open({
              templateUrl: 'presentation/feed/resolveModal/resolveModal.tpl.html',
              controller: 'CtrlFeedsResolveModal',
              windowClass: 'feedsAcceptModal',
              scope: $scope,
              resolve: { modalAction: function() { return action; } }
            });

          } else {

            var _modalInstance = $uibModal.open({
              templateUrl: 'presentation/feed/actionsModal/actionsModal.tpl.html',
              controller: 'CtrlFeedsAcceptModal',
              windowClass: 'feedsAcceptModal',
              scope: $scope,
              resolve: { modalAction: function() { return action; } }
            });

          }


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

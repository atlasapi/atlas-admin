'use strict';

angular
  .module('atlasAdmin.applications')
  .controller('CreateApplicationFormModalCtrl', CreateApplicationFormModalCtrl);

CreateApplicationFormModalCtrl.$inject = ['$scope', '$q', '$sce', '$uibModalInstance', 'Applications', 'sourceRequests', 'SourceLicenses', '$location'];

function CreateApplicationFormModalCtrl($scope, $q, $sce, $uibModalInstance, Applications, SourceRequests, SourceLicenses, $location) {
  $scope.app.showTerms = false;
  $scope.app.acceptTerms = false;
  $scope.app.title = '';
  $scope.app.url = '';
  $scope.app.description = '';
  $scope.app.preset = null;
  $scope.license = {};
  $scope.license.show = false;

  var getTerms = function(source) {
    var defer = $q.defer();
    var sourceId = null;

    if (source === 'PA') {
      sourceId = 'cpc';
    } else if (source === 'BBC') {
      sourceId = 'cpy';
    }

    SourceLicenses
      .get(sourceId)
      .then(function(data) {
        if (!_.isObject(data)) {
          return false
        }

        var license = $sce.trustAsHtml(data.license);
        defer.resolve(license);
    });

    return defer.promise;
  };

  // decide whether terms should be shown for this source set
  $scope.termsToggle = function(preset) {
    $scope.app.showTerms = ($scope.app.preset == 'uk')
  };

  // used to show the user terms for source
  $scope.showTerms = function(source) {
    getTerms(source)
      .then(function(license) {
        $scope.license.show = true;
        $scope.license.html = license;
    });
  };

  $scope.submit = function() {
    var app_title = $scope.app.title;
    var app_url = $scope.app.url;
    var app_description = $scope.app.description;
    var app_preset = $scope.app.preset;
    var app_terms = $scope.app.acceptTerms;

    // save the app data
    if (!_.isEmpty(app_title) && !_.isEmpty(app_url) && _.isString(app_preset)) {
      if (app_preset === 'uk' && !app_terms) {
        return;
      }

      Applications.create(app_title, app_description, app_url).then(function(result) {
        if (result.data.application.id) {
          var appId = result.data.application.id;

          // enable basic sources matching on simple account
          if (app_preset === 'uk') {
            var _item, sourceOrder = [], enableSources = [];

            for (var source in result.data.application.sources.reads) {
              _item = result.data.application.sources.reads[source];

              if (_item.title === 'BBC' || _item.title === 'PA') {
                enableSources.push(_item);
              }

              sourceOrder.push(_item.id);
            }

            // send source requests for default sources
            _(enableSources).forEach(function(src) {
              SourceRequests.send(src.id, appId, app_url, '', 'personal', true);
            });

            Applications.setPrecedence(appId, sourceOrder);
          } else {
            $location.path('/applications/'+appId);
          }

          // close modal and return data to the $scope
          result.data.application.source = $scope.app.sources;
          $uibModalInstance.close(result.data.application);
        }
      });
    }
  };

  // cancel and close modal
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}

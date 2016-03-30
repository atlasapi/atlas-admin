'use strict';

angular
  .module('atlasAdmin.applications')
  .controller('CtrlApplications', CtrlApplications);

CtrlApplications.$inject = ['$scope', '$rootScope', '$routeParams', 'Applications', '$uibModal', '$location', 'Atlas', 'Authentication', 'atlasApiHost', '$http', '$log'];

function CtrlApplications($scope, $rootScope, $routeParams, Applications, $uibModal, $location, Atlas, Authentication, atlasApiHost, $http, $log) {
  $scope.view_title = 'My Applications';
  $scope.app = {};
  $scope.app.predicate = 'created';
  $scope.app.reverse = true;
  $scope.app.pageSize = 10;
  $scope.app.currentPage = 1;
  $scope.isAdmin = false;

  function httpSuccess(response) {
    var roles = response.data.role;
    var applications = [];

    roles.forEach(function(role) {
      if (role.id === 'admins') {
        $scope.isAdmin = true;
      }
    });

    $scope.app.applications = [];

    if ($scope.isAdmin) {
      Atlas
        .getRequest('http://admin-backend.metabroadcast.com/1/applications')
        .then(function(response) {
          var applications = response.data.applications;

          applications.forEach(function(application) {
            Atlas
              .getRequest('http://admin-backend.metabroadcast.com/1/applications/' + application.id)
              .then(function(response) {
                formatApplicationAndUpdateView(response.data.application);
              })
              .catch(httpError);
          });
        })
        .catch(httpError);
    } else {
      roles.forEach(function(role) {
        Atlas
          .getRequest('http://admin-backend.metabroadcast.com/1/applications/' + role.id)
          .then(function(response) {
            formatApplicationAndUpdateView(response.data.application);
          })
          .catch(httpError);
      });
    }
  }

  function formatApplicationAndUpdateView(application) {
    application.credentials = {};
    application.credentials.apiKey = getApiKey(application);
    $scope.app.applications.push(application);
    $scope.state = ($scope.app.applications.length) ? 'table' : 'blank';
    getUsageData($scope.app.applications);
  }

  function getApiKey(application) {
    if (application.credentialsConfig.length) {
      return application.credentialsConfig[0].apiKey;
    } else {
      return '';
    }
  }

  function httpError(error) {
    $log.error(error);
  }

  Atlas
    .getRequest('http://admin-backend.metabroadcast.com/1/user')
    .then(httpSuccess)
    .catch(httpError);

  function getUsageData(applications) {
    var TIME_PERIOD = 8;
    var dates = [];

    for (var i = 0, ii = TIME_PERIOD; i < ii; i++) {
      dates.push('logstash-atlas-access-' + moment().subtract(i, 'days').format('YYYY.MM.DD'));
    }

    dates = dates.join(',');

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    $http
      .get(Authentication
      .appendTokenToUrl(atlasApiHost + '/usage-list/' + dates))
      .then(function (response) {
        var usageData =  _.has(response, 'data') ? response.data.aggregations.apiKeys.buckets : null;
          if (! usageData) {
            console.warn('Response data doesnt have the `data` property', response);
            return;
          }

          _.forEach(usageData, function (d) {
            d.readableCount = numberWithCommas(d.doc_count);
          });

          applications = handleNullUsage(applications);
          mapUsageDataToApplications(applications, usageData);
    });
  };

  function handleNullUsage(applications) {
    applications.forEach(function(application) {
      application.usage = {
        doc_count: 0,
        readableCount: 0
      };
    });

    return applications;
  };

  function mapUsageDataToApplications(applications, usageData) {
    applications = _.map(applications, function (application) {
      _.forEach(usageData, function (d) {
        if (application.credentialsConfig[0].apiKey === d.key) {
          application.usage = d;
        }
      });
    });
  };

  // instantiate a new modal window
  $scope.createApplication = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'presentation/applications/createModal/applicationCreateModal.tpl.html',
      controller: 'CreateApplicationFormModalCtrl',
      scope: $scope
    });

    modalInstance.result.then(function(application) {
      // if all sources are selected, go to edit page
      if ('all' === application.source) {
        $location.path('/applications/' + application.id);
      } else {
        $scope.app.applications.push(application)
      }
    });
  };

  $scope.appSearchFilter = function(application) {
    if (!$scope.query || $scope.query === '') {
      return true;
    }

    // Search on title match or if query is over 10 chars long the api key
    return application.title.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1
      || ($scope.query.length > 10 && application.credentials.apiKey.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1);
  };
}

'use strict';

var app = angular.module('atlasAdmin.controllers.admins.usage', []);

app.controller('CtrlUsage', ['$scope', '$rootScope', 'Authentication', 'atlasApiHost', '$http', function($scope, $rootScope, Authentication, atlasApiHost, $http) {
  var getUsageData = function () {
    var TIME_PERIOD = 8;
    var dates = [];

    for (var i = 0, ii = TIME_PERIOD; i < ii; i++) {
      dates.push('logstash-atlas-access-' + moment().subtract(i, 'days').format('YYYY.MM.DD'));
    }

    dates = dates.join(',');

    $http.get(Authentication.appendTokenToUrl(atlasApiHost + '/usage-list/' + dates)).then(function (response) {
      $scope.requests = response.data.aggregations.apiKeys.buckets;
    });
  };

  getUsageData();
}]);

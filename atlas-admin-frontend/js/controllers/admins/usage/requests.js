'use strict';

var app = angular.module('atlasAdmin.controllers.admins.usage', []);

app.controller('CtrlUsage', ['$scope', '$rootScope', 'Authentication', 'atlasApiHost', '$http', function($scope, $rootScope, Authentication, atlasApiHost, $http) {
  var getUsageData = function () {
    var TIME_PERIOD = 3;
    var dates = [];

    for (var i = 0, ii = TIME_PERIOD; i < ii; i++) {
      dates.push('logstash-atlas-access-' + moment().subtract(i, 'days').format('YYYY.MM.DD'));
    }

    dates = dates.join(',');

    var numberWithCommas = function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    $http.get(Authentication.appendTokenToUrl(atlasApiHost + '/usage-list/' + dates)).then(function (response) {
      var usageData = response.data.aggregations.apiKeys.buckets;
      _.forEach(usageData, function (d) {
        d.readableCount = numberWithCommas(d.doc_count);
      });
      $scope.requests = usageData;
    });
  };

  getUsageData();
}]);

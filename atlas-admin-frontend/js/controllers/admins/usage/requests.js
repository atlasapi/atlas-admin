'use strict';

var app = angular.module('atlasAdmin.controllers.admins.usage', []);

app.controller('CtrlUsage', ['$scope', '$rootScope', 'Authentication', 'atlasApiHost', '$http', function($scope, $rootScope, Authentication, atlasApiHost, $http) {
  var getUsageData = function () {
    var timePeriod = 'logstash-atlas-access-2015.06.09,logstash-atlas-access-2015.06.08,logstash-atlas-access-2015.06.07,logstash-atlas-access-2015.06.06,logstash-atlas-access-2015.06.05,logstash-atlas-access-2015.06.04,logstash-atlas-access-2015.06.03,logstash-atlas-access-2015.06.02';

    $http.get(Authentication.appendTokenToUrl(atlasApiHost + '/usage-list/' + timePeriod)).then(function (response) {
      $scope.requests = response.data.aggregations.apiKeys.buckets;
    });
  };

  getUsageData();
}]);

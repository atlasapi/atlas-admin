'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.view_title = 'Feeds Console'

    Feeds.request('youview/bbc_nitro/transactions.json')
    .then(function(data) {
        $scope.transactions = data.transactions;
        console.log(data);
    });

    //  Used for calculating uptime since last outage
    //
    //  @param last_outage {date}
    //
    var calculateUptime = function(last_outage) {
        var _now = new Date(),
            _then = last_outage,
            _delta = Math.round(Math.abs((_now.getTime() - _then.getTime()))/(24*60*60*1000));
        return _delta.toString();
    }

    Feeds.request('youview/bbc_nitro/statistics.json')
    .then(function(data) {
        $scope.statistics = data.feed_stats[0];
        $scope.statistics.uptime = calculateUptime( new Date(data.feed_stats[0].last_outage) );
        console.log(data.feed_stats[0]);
    });
}])
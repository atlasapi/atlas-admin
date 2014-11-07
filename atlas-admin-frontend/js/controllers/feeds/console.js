'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.error = {};
    $scope.error.show = false;
    $scope.view_title = 'Feeds Console';

    // set up ordering
    $scope.table = {};
    $scope.table.reverse = false;
    $scope.table.order = 'id';

    $scope.search = {};

    Feeds.request('youview/bbc_nitro/transactions.json')
    .then(function(data) {
        if (_.isObject(data.error)) {
            $scope.error.show = true;
            $scope.error.obj = data.error;
        }
        $scope.transactions = data.transactions;
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
    });
}])
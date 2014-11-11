'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.transactions = [];
    $scope.error = {};
    $scope.error.show = false;
    $scope.view_title = 'Feeds Console';
    $scope.statusFilter = ['accepted', 'validating', 'failed', 'quarantined', 'committing', 'committed', 'publishing', 'published'];

    // pagination settings
    $scope.page = {};
    $scope.page.current = 0;
    $scope.page.limit = 9;
    $scope.page.offset = 0;

    // set up ordering and search
    $scope.table = {}; 
    $scope.table.order = 'upload_time';
    $scope.table.reverse = true;
    $scope.activeFilter = '';
    $scope.search = {};


    // Used for initiating filtering on a field
    // @param filter_on {string} value to set for activeFilter
    $scope.filter = function(filter_on) {
        if (!_.isString(filter_on)) return;
        if ($scope.search[filter_on].length > 3 || $scope.search[filter_on].length == 0) {
            $scope.activeFilter = filter_on;
            $scope.page.current = 0;
            getTransactions()
        }
    }


    // Used for controlling pagination functionality. The idea is that
    // page.current is watched for changes, then the transactions list
    // is reloaded from the server with new offset params
     $scope.page.next = function() {
        ++$scope.page.current;
    }
    $scope.page.previous = function() {
        if ($scope.page.current > 0) --$scope.page.current;
    }
    $scope.$watch('page.current', function(new_val, old_val) {
        $scope.page.offset = $scope.page.current * $scope.page.limit;
        getTransactions()
    });


    // For loading sets of transactions from atlas. Filters and offsets
    // are inserted automatically based on $scope variables
    var getTransactions = function() {
        var _filter = '';
        if ($scope.activeFilter === 'uri' && !_.isEmpty($scope.search.uri)) {
            _filter = '&uri='+$scope.search.uri;
        }else if ($scope.activeFilter === 'status' && !_.isEmpty($scope.search.status)) {
            _filter = '&status='+$scope.search.status;
        }else if ($scope.activeFilter === 'transaction_id' && !_.isEmpty($scope.search.transaction_id)){
            _filter = '&transaction_id='+$scope.search.transaction_id;
        }
        var request_url = 'youview/bbc_nitro/transactions.json?limit='+$scope.page.limit+'&offset='+$scope.page.offset+_filter;
        console.log(request_url)
        Feeds.request(request_url).then(function(data) {
            pushTransactionsTable(data);
        });
    }


    // For loading the feed statistics from atlas
    var getStats = function() {
        Feeds.request('youview/bbc_nitro/statistics.json').then(function(data) {
            $scope.statistics = data.feed_stats[0];
            $scope.statistics.uptime = calculateUptime( new Date(data.feed_stats[0].last_outage) );
        });
    }
    getStats();

    // Used for loading data into the transactions scope
    // @param data {object} the transactions object
    var pushTransactionsTable = function(data) {
        if (_.isObject(data.error)) {
            $scope.error.show = true;
            $scope.error.obj = data.error;
        }
        $scope.transactions = data.transactions;
    }

    // Used for calculating uptime since last outage
    // @param last_outage {date}
    var calculateUptime = function(last_outage) {
        var _now = new Date(),
            _then = last_outage,
            _delta = Math.round(Math.abs((_now.getTime() - _then.getTime()))/(24*60*60*1000));
        return _delta.toString();
    }
}])
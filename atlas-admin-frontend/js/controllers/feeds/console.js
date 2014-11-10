'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.error = {};
    $scope.error.show = false;
    $scope.view_title = 'Feeds Console';
    $scope.statusFilter = ['accepted', 'validating', 'failed', 'quarantined', 'committing', 'committed', 'publishing', 'published'];

    // pagination settings
    $scope.page = {};
    $scope.page.current = 1;
    $scope.page.limit = 1;
    $scope.page.offset = 1;

    $scope.page.page_count = function() {
        return Math.ceil($scope.transactions.length / $scope.page.limit);
    }

    $scope.$watch('page.current + page.limit', function() {
        console.log('yop');
    });

    // set up ordering
    $scope.table = {};
    $scope.table.order = 'id';
    $scope.table.reverse = false;

    // search
    $scope.search = {};

    $scope.filter = {};
    $scope.filter.uri = function() {
        var filter = $scope.search.content[0];
        if (!filter) {
            getAllTransactions();
        }else{
            Feeds.request('youview/bbc_nitro/transactions.json?uri='+filter).then(function(data) {
                pushTransactionsTable(data);
            });
        }
    }

    $scope.filter.status = function() {
        var filter = $scope.search.status;
        if (!filter) {
            getAllTransactions();
        }else{
            Feeds.request('youview/bbc_nitro/transactions.json?status='+filter).then(function(data) {
                pushTransactionsTable(data);
            });
        }
    }

    $scope.filter.transaction_id = function() {
        var filter = $scope.search.id;
        clearTimeout(timeout);
        var timeout = setTimeout(function() {
            Feeds.request('youview/bbc_nitro/transactions.json?transaction_id='+filter).then(function(data) {
                pushTransactionsTable(data);
            });
        }, 200);
    }

    // for loading all the transactions
    var getAllTransactions = function() {
        Feeds.request('youview/bbc_nitro/transactions.json?limit='+$scope.page.limit+'&offset=4').then(function(data) {
            pushTransactionsTable(data);
        });
    }
    getAllTransactions();

    // for loading in the feed stats
    var getStats = function() {
        Feeds.request('youview/bbc_nitro/statistics.json').then(function(data) {
            $scope.statistics = data.feed_stats[0];
            $scope.statistics.uptime = calculateUptime( new Date(data.feed_stats[0].last_outage) );
        });
    }
    getStats();

    //  Used for loading data into the transactions scope
    //
    //  @param data {object} the transactions object
    //
    var pushTransactionsTable = function(data) {
        if (_.isObject(data.error)) {
            $scope.error.show = true;
            $scope.error.obj = data.error;
        }
        $scope.transactions = data.transactions;
    }

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
}])
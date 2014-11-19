'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modal',
    function($scope, $rootScope, $routeParams, Feeds, $q, $modal) {
    $scope.transactions = [];
    $scope.error = {};
    $scope.error.show = false;
    $scope.view_title = 'Feeds Console';
    $scope.statusFilter = ['accepted', 'validating', 'failed', 'quarantined', 'committing', 'committed', 'publishing', 'published'];

    // set up ordering and search
    $scope.table = {}; 
    $scope.table.order = 'upload_time';
    $scope.table.reverse = true;
    $scope.activeFilter = '';
    $scope.search = {};


    // this controls the loading state of the feeds console
    $scope.isloading = false;

    // this will tell the view whether or not the action buttons are disabled
    $scope.disableActions = true;


    // Used for initiating filtering on a field. changes the activeFilter
    // param and then reloads the transactions list.
    //
    // @param filter_on {string} value to set for activeFilter
    //
    $scope.filter = function(filter_on) {
        if (!_.isString(filter_on)) return;
        if ($scope.search[filter_on].length > 3 || $scope.search[filter_on].length == 0) {
            $scope.isloading = true;
            $scope.activeFilter = filter_on;
            $scope.page.current = 0;
            getTransactions()
        }
    }


    // Used for controlling pagination functionality. The idea is that
    // page.current is watched for changes, then the transactions list
    // is reloaded from the server with new offset params 
    $scope.page = {};
    $scope.page.current = 0;
    $scope.page.limit = 15;
    $scope.page.offset = 0;
    $scope.page.showPager = false;

    $scope.$watch('page.limit', function(new_val, old_val) {
        $scope.isloading = true;
        $scope.page.current = 0;
        $scope.page.showPager = ($scope.transactions.length < $scope.page.limit) ? false : true;
    });

    $scope.$watch('page.current + page.limit', function(new_val, old_val) {
        $scope.page.offset = $scope.page.current * $scope.page.limit;
        getTransactions()
    });
    
    $scope.page.next = function() {
        if ($scope.transactions.length >= $scope.page.limit && !$scope.isloading) {
            $scope.isloading = true;
            ++$scope.page.current;
        }
    }

    $scope.page.previous = function() {
        if ($scope.page.current > 0 && !$scope.isloading) {
            $scope.isloading = true;
            --$scope.page.current;
        }
    }


    // The following is used for selecting individual transactions 
    // and running actions on them
    $scope.selectedTransactions = [];
    $scope.updateSelection = function(transaction_id) {
        if (!_.isString(transaction_id)) return;
        if ($scope.selectedTransactions.indexOf(transaction_id) > -1) {
            var _index = $scope.selectedTransactions.indexOf(transaction_id);
            $scope.selectedTransactions.splice(_index, 1);
        }else{
            $scope.selectedTransactions.push(transaction_id);
        }
        if ($scope.selectedTransactions.length) {
            $scope.disableActions = false;
        }else{
            $scope.disableActions = true;
        }
    }


    // Here we see all the trans... actions... see what I did there?
    $scope.actions = {};

    $scope.actions.acceptModal = function(action) {
        var _transactionsLength = $scope.selectedTransactions.length;
        if (!_.isString(action) || !_transactionsLength) return;

        var _content = {
            title: 'Are you sure you want to <strong>'+action+' '+_transactionsLength+'</strong> transactions?',
            action: action.charAt(0).toUpperCase() + action.slice(1)
        }

        var _modalInstance = $modal.open({
            template: '<h1>'+_content.title+'</h1></div><div class="feed-modal-options"><button>'+_content.action+'</button><button ng-click="dismiss()">Cancel</button>',
            controller: 'CtrlFeedsAcceptModal',
            windowClass: 'feedsAcceptModal'
        });

        // TODO: decide on action to run
    }


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
        $scope.isloading = false;
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


app.controller('CtrlFeedsAcceptModal', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {

    $scope.dismiss = function() {
        $modalInstance.close();
    }

    $scope.republish = function() {

    }

    $scope.revoke = function() {
        
    }

    $scope.unrevoke = function() {
        
    }

    $scope.delete = function() {
        
    }
}])
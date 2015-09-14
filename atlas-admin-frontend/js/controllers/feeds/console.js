'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$timeout',
    function($scope, $rootScope, $routeParams, Feeds, $q, $timeout) {
    $scope.tasks = [];
    $scope.error = {};
    $scope.error.show = false;
    $scope.view_title = 'Feeds Console';
    $scope.statusFilter = ['accepted', 'validating', 'failed', 'quarantined', 'committing', 'committed', 'publishing', 'published'];
    $scope.transactionFilter = ['BRAND', 'SERIES', 'ITEM', 'VERSION', 'BROADCAST', 'ONDEMAND'];

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
    // param and then reloads the tasks list.
    //
    // @param filter_on {string} value to set for activeFilter
    //
    var input_timer;
    $scope.filter = function(filter_on) {
        if (!_.isString(filter_on)) {
          return;
        }
        
        if ($scope.search[filter_on].length > 3 || $scope.search[filter_on].length === 0) {
            $timeout.cancel(input_timer);
            input_timer = $timeout(function() {
                $scope.isloading = true;
                $scope.activeFilter = filter_on;
                $scope.page.current = 0;
                getTasks();
            }, 700);
        }
    };


    // Used for controlling pagination functionality. The idea is that
    // page.current is watched for changes, then the tasks list
    // is reloaded from the server with new offset params 
    $scope.page = {};
    $scope.page.current = 0;
    $scope.page.limit = 15;
    $scope.page.offset = 0;
    $scope.page.showPager = false;

    $scope.$watch('page.limit', function(new_val, old_val) {
        $scope.isloading = true;
        $scope.page.current = 0;
        $scope.page.showPager = ($scope.tasks.length >= $scope.page.limit) ? false : true;
    });

    $scope.$watch('page.current + page.limit', function(new_val, old_val) {
        $scope.page.offset = $scope.page.current * $scope.page.limit;
        getTasks();
    });
    
    $scope.page.next = function() {
        if ($scope.tasks.length >= $scope.page.limit && !$scope.isloading) {
            $scope.isloading = true;
            ++$scope.page.current;
            $scope.selectedTasks = [];
            $scope.disableActions = true;
        }
    };

    $scope.page.previous = function() {
        if ($scope.page.current > 0 && !$scope.isloading) {
            $scope.isloading = true;
            --$scope.page.current;
            $scope.selectedTasks = [];
            $scope.disableActions = true;
        }
    };


    // The following is used for selecting individual tasks 
    $scope.selectedTasks = [];
    $scope.updateSelection = function(task_id) {
        if (_.isString(task_id)) {
            if ($scope.selectedTasks.indexOf(task_id) > -1) {
                var _index = $scope.selectedTasks.indexOf(task_id);
                $scope.selectedTasks.splice(_index, 1);
            }else{
                $scope.selectedTasks.push(task_id);
            }
        }
        if ($scope.selectedTasks.length) {
            $scope.disableActions = false;
        }else{
            $scope.disableActions = true;
        }
    };

    // For loading sets of tasks from atlas. Filters and offsets
    // are inserted automatically based on $scope variables
    var getTasks = function() {
        var _filter = '';
        if ($scope.activeFilter === 'transaction' && ! _.isEmpty($scope.search.transaction)) {
            _filter = '&type='+$scope.search.transaction.toLowerCase();
        }else if ($scope.activeFilter === 'uri' && ! _.isEmpty($scope.search.uri)) {
            _filter = '&uri='+$scope.search.uri;
        }else if ($scope.activeFilter === 'status' && ! _.isEmpty($scope.search.status)) {
            _filter = '&status='+$scope.search.status;
        }else if ($scope.activeFilter === 'remote_id' && ! _.isEmpty($scope.search.remote_id)){
            _filter = '&remote_id='+$scope.search.remote_id;
        }
        var request_url = 'youview/bbc_nitro/tasks.json?limit='+$scope.page.limit+'&offset='+$scope.page.offset+_filter;
        Feeds.request(request_url).then(pushTasksTable);
    };


    // For loading the feed statistics from atlas
    var getStats = function() {
        Feeds.request('youview/bbc_nitro/statistics.json').then(function(data) {
            $scope.statistics = data.feed_stats[0];
            $scope.statistics.uptime = calculateUptime( new Date(data.feed_stats[0].last_outage) );
        });
    };
    getStats();


    // Used for loading data into the tasks scope
    // @param data {object} the tasks object
    var pushTasksTable = function(data) {
        if (_.isObject(data.error)) {
            $scope.error.show = true;
            $scope.error.obj = data.error;
            return;
        }
        $scope.isloading = false;
        $scope.tasks = data.tasks;
    };


    // Used for calculating uptime since last outage
    // @param last_outage {date}
    var calculateUptime = function(last_outage) {
        var _now = new Date(),
            _then = last_outage,
            _delta = Math.round(Math.abs((_now.getTime() - _then.getTime()))/(24*60*60*1000));
        return _delta.toString();
    };
}]);


app.directive('actionModal', ['$document', '$q', '$modal',
    function($document, $q, $modal) {
    var controller = function($scope, el, attr) {
        var modal = function(action) {
            var defer = $q.defer();
            $scope.selectedTasks = $scope.selectedTasks || [];
            var _tasksLength = $scope.selectedTasks.length || 1;

            if (!_.isString(action)) {
                defer.reject();
                return defer.promise;
            }

            var _content = {
                title: 'Are you sure you want to <strong>'+action+' '+_tasksLength+'</strong> tasks?',
                action: action.charAt(0).toUpperCase() + action.slice(1)
            };

            var _modalInstance = $modal.open({
                template: '<h1>'+_content.title+'</h1></div><div class="feed-modal-options"><button ng-disabled="isSendingAction" ng-click="ok()">'+_content.action+'</button><button ng-click="dismiss()">Cancel</button>',
                controller: 'CtrlFeedsAcceptModal',
                windowClass: 'feedsAcceptModal',
                scope: $scope,
                resolve: { modalAction: function() { return action; } }
            });

            _modalInstance.result.then(defer.resolve, defer.reject);
            return defer.promise;
        };

        $(el).on('click', function() {
            if ($scope.task || $scope.tasks) {
                var action = attr.actionModal || null;
                modal(action).then(function() {
                    $scope.selectedTasks = [];
                    $scope.updateSelection();
                });
            }
        });
    };

    return {
        scope: false,
        link: controller
    };
}]);

app.controller('CtrlFeedsAcceptModal', ['$scope', '$modalInstance', '$q', 'FeedsService', 'modalAction',
    function($scope, $modalInstance, $q, Feeds, modalAction) {
    var action = modalAction;
    $scope.isSendingAction = false;

    $scope.ok = function() {
        var _task = $scope.tasks || $scope.task;
        $scope.isSendingAction = true;
        Feeds.action(action, _task, $scope.selectedTasks).then($modalInstance.close,
        function() {
            console.error('Problem with action request');
        });
    };

    $scope.dismiss = function() {
        $modalInstance.dismiss();
    };
}]);

'use strict';
angular.module('atlasAdmin.feed')
  .controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$timeout',
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
      $scope.activeFilters = [];
      $scope.urlFilters = [];
      $scope.search = {};
      $scope.currentSortValue = '';
      $scope.sortOrder = '.asc';


      // this controls the loading state of the feeds console
      $scope.isloading = false;

      // this will tell the view whether or not the action buttons are disabled
      $scope.disableActions = false;


      // Used for initiating filtering on a field. changes the activeFilter
      // param and then reloads the tasks list.
      //
      // @param filter_on {string} value to set for activeFilter
      //
      var input_timer;

      $scope.filter = function(filter_on) {
        if (! _.isString(filter_on)) {
          return;
        }

        if ($scope.search[filter_on].length > 2 || $scope.search[filter_on].length === 0) {

          var filterData = {};

          var savedObject = _.find($scope.activeFilters, {'name': filter_on});

          if (savedObject){
            if ($scope.search[filter_on].length === 0) {
              _.remove($scope.activeFilters, savedObject);
            } else {
              savedObject.value = $scope.search[filter_on];
            }
          } else {
            $scope.isloading = true;
            filterData.name = filter_on;
            filterData.value = $scope.search[filter_on];

            $scope.activeFilters.push(filterData);
            $scope.page.current = 0;
          }
        }

        getTasks($scope.currentSortValue);
      };

      $scope.sortTasks = function (sortValue) {
        if ($scope.currentSortValue === sortValue) {
          if ($scope.sortOrder === '.desc') {
            $scope.sortOrder = '.asc';
          } else if ($scope.sortOrder === '.asc') {
            $scope.sortOrder = '.desc';
          }
        }
        getTasks(sortValue);
      }


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
        getTasks($scope.currentSortValue);
      });

      $scope.page.next = function() {
        if ($scope.tasks.length >= $scope.page.limit && !$scope.isloading) {
          $scope.isloading = true;
          ++$scope.page.current;
        }
      };

      $scope.page.previous = function() {
        if ($scope.page.current > 0 && !$scope.isloading) {
          $scope.isloading = true;
          --$scope.page.current;
        }
      };


      // For loading sets of tasks from atlas. Filters and offsets
      // are inserted automatically based on $scope variables
      var getTasks = function(sortValue) {
        var sortBy = '';
        var filters = [];

        if (_.find($scope.activeFilters, {'name': 'transaction'})) {
          filters.push( '&type='+$scope.search.transaction.toLowerCase() );
        }
        if (_.find($scope.activeFilters, {'name': 'uri'})) {
          filters.push( '&uri='+$scope.search.uri );
        }
        if (_.find($scope.activeFilters, {'name': 'status'})) {
          filters.push( '&status='+$scope.search.status );
        }
        if (_.find($scope.activeFilters, {'name': 'remote_id'})){
          filters.push( '&remote_id='+$scope.search.remote_id );
        }

        if(sortValue){
          sortBy = '&order_by=' + sortValue + $scope.sortOrder;
          $scope.currentSortValue = sortValue;
        }

        var filter = filters.join('');

        var request_url = 'youview/bbc_nitro/tasks.json?limit='+$scope.page.limit+'&offset='+$scope.page.offset+filter+sortBy;
        Feeds.request(request_url).then(pushTasksTable);
      };


      // For loading the feed statistics from atlas
      var getStats = (function() {
        Feeds.request('youview/bbc_nitro/statistics.json').then(function(data) {
          if (! data.feed_stats) {
            return;
          }
          var stats = data.feed_stats[0];
          $scope.statistics = {};
          $scope.statistics.queue_size = stats.queue_size;
          $scope.statistics.uptime = stats.update_latency_string;
        });
      })();

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

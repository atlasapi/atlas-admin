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
      if (! data.feed_stats) {
        return;
      }
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
      
      if (!_.isString(action)) {
        defer.reject();
        return defer.promise;
      }
      
      var _content = {
        title: '<strong>'+action+'</strong> task?',
        action: action.charAt(0).toUpperCase() + action.slice(1)
      };
      
      var _modalInstance = $modal.open({
        // template: '<h1>'+_content.title+'</h1></div><div class="feed-modal-options"><button ng-disabled="isSendingAction" ng-click="ok()">'+_content.action+'</button><button ng-click="dismiss()">Cancel</button>',
        templateUrl: 'partials/feeds/actionsModal.html',
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
        modal(action).then( function() {
          
        });
      }
    });
  };
  
  return {
    scope: false,
    link: controller
  };
}]);

app.controller('CtrlFeedsAcceptModal', ['$scope', '$modalInstance', '$q', 'FeedsService', 'modalAction', '$http', 'atlasHost',
function($scope, $modalInstance, $q, Feeds, modalAction, $http, atlasHost) {
    var pidLength = 8;
    $scope.actionName = modalAction;
    $scope.pidValue = '';
    $scope.showSearchRes = false;
    $scope.resultMessage = false;
    $scope.clearUI = false;
    $scope.atlasResult = {  };
    $scope.uiStrings = {
      revoke: 'Revoke',
      upload: 'Publish'
    };
    
    var trimString = function (wordCount, string) {
      var append = '';
      var words = string.split(' ');
      
      if (words.length > wordCount) {
        append = '...';
      }
      var truncated = words.slice(0, wordCount).join(' ');
      return truncated + append;
    };
    
    var runRevoke = function (pid) {
      var defer = $q.defer();
      var payload = {
        uri: 'http://nitro.bbc.co.uk/programmes/' + pid
      };
      
      Feeds.request('youview/bbc_nitro/action/revoke', 'post', payload).then(
      function (data, status) {
        $scope.showSearchRes = false;
        $scope.atlasResult = {  };
        $scope.resultMessage = 'The revoke transaction has been added to the queue';
        $scope.clearUI = true;
      }, console.error);
      
      return defer.promise;
    };
    
    var runIngest = function (pid) {
      var defer = $q.defer();
      var payload = {};
      Feeds.request('forceUpdate/' + pid, 'post', payload).then(
      function (data, status) {
        $scope.showSearchRes = false;
        $scope.atlasResult = {  };
        $scope.resultMessage = 'The publish transaction has been added to the queue';
        $scope.clearUI = true;
      }, console.error);
      
      return defer.promise;
    };
      

    
    $scope.findPid = function (pidValue) {
      if (pidValue.length !== pidLength) {
        return console.warn('PID isn\'t the correct length');
      }
      var nitroUri = 'http://nitro.bbc.co.uk/programmes/' + pidValue;
      $http.get(atlasHost + '/3.0/content.json?apiKey=2b8d39c3ed3040aca8c30a46bd38e685&uri=' + nitroUri + '&annotations=description,extended_description,brand_summary')
        .success( function (data, status) {
          var atlasres = data.contents[0];
          if (atlasres) {
            $scope.showSearchRes = true;
            $scope.atlasResult.imageUrl = atlasres.image;
            $scope.atlasResult.title = atlasres.title;
            $scope.atlasResult.brand = atlasres.container.title || '';
            $scope.atlasResult.time = 1;
            $scope.atlasResult.description = trimString(60, atlasres.description);
          }
        });
    };    
    
    
    $scope.triggerAction = function (actionName, pid) {
      if (! pid) {
        return console.warn('cannot trigger action because there is no pid argument');
      }
      if (! actionName) {
        return console.warn('cannot trigger action because there is no actionName argument');
      }
      switch (actionName) {
        case 'upload': runIngest(pid); break;
        case 'revoke': runRevoke(pid); break;
      }
    };
    
    $scope.dismiss = function() {
      $modalInstance.dismiss();
    };
  }]);

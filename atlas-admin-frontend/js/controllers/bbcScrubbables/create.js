var app = angular.module('atlasAdmin.controllers.bbcscrubbables', []);

app.controller('CtrlBBCScrubbables', ['$scope', '$rootScope', '$routeParams', '$q', 'BBCScrubbablesService', '$timeout', 'ScrubbablesHelpers',
function($scope, $rootScope, $routeParams, $q, Scrubbables, $timeout, Helpers) {
  $scope.view_title = 'TV linker';
  $scope.showUI = false;
  $scope.loading = false;
  $scope.item = {};
  $scope.showSegments = {};
  $scope.atlasSearch = {};
  $scope.scrubber = {};

  // Grab api keys and keep in scope for later
  Scrubbables.keys().then(function(keys) {
    $scope.searchKey = keys.owlRead;
    $scope.writeKey = keys.owlWrite;
    $scope.deerKey = keys.deerRead;
    // load previous item if there exists an id in the url
    if ($routeParams.atlasId) {
      loadAtlasItem($routeParams.atlasId);
    }
  },
  function(err) {
    console.error(err);
  });


  var calculateSegmentDuration = function(start, end, broadcastDuration) {
    console.log(start, end, broadcastDuration);
    return (broadcastDuration - start) - (broadcastDuration - end);
  };


  $scope.generateID = function() {
    return Math.random().toString(36).substr(2, 9);
  };


  var showMessage = function(message, type) {
    var _timer;
    _type = type || 'normal';
    $scope.message = message;
    $scope.showMessage = true;
    _timer = $timeout(function() {
      $scope.message = '';
      $scope.showMessage = false;
    }, 7000);
  };


  // This is for loading the saved segments and inserting them into the $scope
  //
  // @param result {Object} Deer result object
  var loadSavedSegments = function (result) {
    var _events = ( ! _.has(result.item, 'segment_events') ) ? null :
                    ( _.isArray(result.item.segment_events) ) ? result.item.segment_events : null;
    if (! _events) {
      console.warn('segment_events array isn\'t in returned Deer object');
      return null;
    }
    return _events;
  };


  var loadAtlasItem = function (id) {
    if (!_.isString(id)) {
      return;
    }
    $scope.loading = true;

    // load related links from deer
    Scrubbables.deerContent($scope.deerKey, id).then(
    function(res) {
      // ..and load broadcast content from owl
      Scrubbables.content.id(id).then(
      function(item) {
        console.log(item);
        $scope.atlasSearch.selectedItem = Helpers.channelFilter(item.contents, 'cbbh')[0];
        $scope.scrubbableSegments = loadSavedSegments(res);
      },
      function(err) {
        console.error(err);
      });
    }, function(err) {
      console.error(err);
    });
  };


  var pushSegmentsToTimeline = function () {
    if (! _.isObject($scope.scrubbableSegments) ) {
      return;
    }
    var _events = $scope.scrubbableSegments;
    console.log($scope.broadcast);
    var broadcastDuration = _.has($scope.broadcast, 'published_duration') ? $scope.broadcast.published_duration : null;

    console.log('ev', _events);

    if (!! broadcastDuration) {

      var showSegments = _.compact( _.map(_events, function (ev) {
        if (ev.offset === 0 && ev.segment.duration === broadcastDuration) {
          return ev;
        }
      }) );

      var timedSegments = _.compact( _.map(_events, function(ev) {
        if (ev.segment.duration < broadcastDuration) {
          return ev;
        }
      }) );

      console.log('show segments', showSegments);
      console.log('timed segments', timedSegments);

      if (showSegments.length) {
        $scope.showSegments.loadSegments(showSegments);
      }
      if (timedSegments.length) {
        $scope.scrubber.loadSegments(timedSegments);
      }
    }
  };


  // When the selectedItem object changes inside the search directive, then
  // update the UI with the new broadcast data
  $scope.$watch('atlasSearch.selectedItem', function() {
    if (!_.isEmpty($scope.atlasSearch.selectedItem)) {
      var _formatted = Helpers.formatResponse($scope.atlasSearch.selectedItem);
      $scope.item = _formatted;
      $scope.episode = $scope.atlasSearch.selectedItem;
      $scope.broadcast = $scope.episode.broadcasts[0];
      $scope.showUI = true;
      $scope.loading = false;
      pushSegmentsToTimeline();
      console.log($scope.episode);
    }
  });

  // Clear the stage of the current item
  $scope.killCurrent = function() {
    $scope.showUI = false;
    $scope.loading = false;
    $scope.item = {};
    $scope.showSegments = {};
    $scope.atlasSearch = {};
    $scope.scrubber = {};
  };

  // Create a new item
  $scope.createNew = function($event) {
    var $target = $($event.target);
    var _out = {};
    var _showLinks = _.union($scope.showSegments.segments, $scope.scrubber.segments);
    var _atlas = {
      id: $scope.episode.id,
      uri: $scope.episode.uri
    };
    var _segments = [];
    for (var i in _showLinks) {
      _segments.push({
        title: _showLinks[i].label,
        url: _showLinks[i].url,
        offset: _showLinks[i].startTime,
        duration: calculateSegmentDuration(_showLinks[i].startTime, _showLinks[i].endTime, $scope.broadcast.duration)
      });
    }
    _out.atlas = _atlas;
    _out.segments = _segments;

    $target.addClass('is-posting');
    $target.prop('disabled', 'true');

    Scrubbables.create($scope.writeKey, _out).then(
    function(contentId) {
      // after the item has been sent to atlas, clear all the things
      $scope.showUI = false;
      $scope.loading = false;
      $scope.item = {};
      $scope.showSegments = {};
      $scope.atlasSearch = {};
      $scope.scrubber = {};
      $target.removeClass('is-posting');
      $target.removeProp('disabled');
      showMessage('The item has been saved');

      Scrubbables.migrateContent(contentId);
    }, function(res) {
      console.error(res);
      showMessage('There was a problem sending the item to Atlas');
    });
  };
}]);

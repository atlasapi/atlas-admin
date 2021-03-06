angular.module('atlasAdmin.directives.showSegments')
  .directive('showSegments', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    // For creating a new segment block to be pushed into the
    // showSegments.segments array
    var createSegmentObj = function(label, url, startTime, duration, id) {
      return {
        label: label,
        url: url,
        startTime: startTime,
        endTime: startTime + duration,
        _id: id
      };
    };


    var controller = function($scope, $el, $attr) {
      var $el = $($el);
      $scope.showSegments = {};
      $scope.showSegments.newItem = {};
      $scope.showSegments.segments = [];
      $scope.showSegments.showCreateUI = false;
      $scope.showSegments.submitted = false;

      $scope.showSegments.loadSegments = function(events) {
        if (! _.isArray(events)) {
          console.error('events expected to be an array');
          return;
        }
        var _segment, _duration;
        _.forEach(events, function (ev) {
          if ( _.has(ev.segment, 'related_links') ) {
            _.forEach(ev.segment.related_links,
            function (link) {
              _duration = ev.segment.duration || 0;
              _segment = createSegmentObj(link.title,
                                          link.url,
                                          0,
                                          _duration,
                                          $scope.generateID());
              $scope.showSegments.segments.push(_segment);
            });
          }
        });
      };

      $scope.showSegments.removeItem = function(id) {
          if (!_.isString(id)) {
            return false;
          }

          for (var i in $scope.showSegments.segments) {
              if ($scope.showSegments.segments[i]._id === id) {
                  console.log(id);
                  $scope.showSegments.segments.splice(i, 1);
                  break;
              }
          }
      };

      $scope.showSegments.createUI = function() {
          $scope.showSegments.showCreateUI = true;
          $scope.showSegments.newItem = {};
      };

      $scope.showSegments.cancel = function() {
          $scope.showSegments.showCreateUI = false;
          $scope.showSegments.newItem = {};
      };

      $scope.showSegments.new = function() {
          $scope.showSegments.submitted = true;
          if (newSegmentForm.linkLabel.value === '' || newSegmentForm.linkUrl.value === '' ) {
            return;
          }

          var _segment = createSegmentObj($scope.showSegments.newItem.label,
                                          $scope.showSegments.newItem.url,
                                          0,
                                          $scope.broadcast.duration,
                                          $scope.generateID());
          $scope.showSegments.segments.push(_segment);
          $scope.showSegments.newItem.label = $scope.showSegments.newItem.url = '';
          $scope.showSegments.showCreateUI = false;
          $scope.showSegments.submitted = false;
      };
    };

    return {
        restrict: 'E',
        scope: false,
        link: controller,
        templateUrl: 'components/directives/showSegments.tpl.html'
    };
  }]);

var app = angular.module('atlasAdmin.directives.bbcscrubbables');

app.directive('showSegments', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    var createSegmentObj = function(label, url, startTime, endTime, id) {
        return {
            label: label,
            url: url,
            startTime: startTime,
            endTime: endTime,
            _id: id
        }
    }

    var controller = function($scope, $el, $attr) {
        var $el = $($el);
        $scope.showSegments = {};
        $scope.showSegments.newItem = {};
        $scope.showSegments.segments = [];
        $scope.showSegments.showCreateUI = false;
        $scope.showSegments.submitted = false;

        $scope.showSegments.loadSegments = function(segments) {
            if (!_.isArray(segments)) {
                console.error('segments expected to be an array')
                return 
            }
            if (segment.related_links.length) {
                var _segment, _item;
                for (var i in segment.related_links) {
                    _item = segment.related_links[i];
                    if (_item.duration === $scope.broadcast.duration) {
                        _segment = createSegmentObj(_item.title, 
                                                    _item.url, 
                                                    0, 
                                                    segment.duration, 
                                                    $scope.generateID());
                        $scope.showSegments.segments.push(_segment);
                    }
                }
            }
        }

        $scope.showSegments.removeItem = function(id) {
            if (!_.isString(id)) return false;
            for (var i in $scope.showSegments.segments) {
                if ($scope.showSegments.segments[i]._id === id) {
                    $scope.showSegments.segments.splice(i, 1);
                    break;
                }
            }
        }

        $scope.showSegments.createUI = function() {
            $scope.showSegments.showCreateUI = true;
            $scope.showSegments.newItem = {};
        }

        $scope.showSegments.cancel = function() {
            $scope.showSegments.showCreateUI = false;
            $scope.showSegments.newItem = {};
        }

        $scope.showSegments.new = function() {
            $scope.showSegments.submitted = true;
            //if (newSegmentForm.linkLabel.value === '' || newSegmentForm.linkUrl.value === '' ) return;
            var _segment = createSegmentObj($scope.showSegments.newItem.label, 
                                            $scope.showSegments.newItem.url, 
                                            0, 
                                            $scope.broadcast.duration, 
                                            $scope.generateID());
            $scope.showSegments.segments.push(_segment)
            $scope.showSegments.newItem.label = $scope.showSegments.newItem.url = '';
            $scope.showSegments.showCreateUI = false;
            $scope.showSegments.submitted = false;
        }
    }

    return {
        restrict: 'E',
        scope: false,
        link: controller,
        templateUrl: 'partials/bbcScrubbables/episodeSegmentPartial.html'
    }
}]);
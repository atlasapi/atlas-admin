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
    }, function(err) { console.error(err) });

    var showMessage = function(message, type) {
        var _timer;
        var _type = type || 'normal';
        $scope.message = message;
        $scope.showMessage = true;
        _timer = $timeout(function() {
            $scope.message = '';
            $scope.showMessage = false;
        }, 7000);
    }

    var loadAtlasItem = function(id) {
        if (!_.isString(id)) return;
        $scope.loading = true;
        // load related links from deer
        Scrubbables.deerContent($scope.deerKey, id).then(
            function(item) {
            console.log('deer', item.segment_events, item.segment_events);
            if (item.segment_events) {
                var showSegments = _.filter(item.segment_events, function(segment) {
                    return (segment.duration === $scope.broadcast.duration) ? true : false;
                })
                var timedSegments = _.filter(item.segment, function(segment) {
                    return (segment.duration > $scope.broadcast.duration) ? true : false;
                })
                $scope.showSegments.loadSegments(showSegments);
                $scope.scrubber.loadSegments(timedSegments);
            }
        }, function(err) { console.error(err) });
        // load broadcast content from owl
        Scrubbables.content.id(id).then(
            function(item) {
            console.log(item);
            $scope.atlasSearch.selectedItem = Helpers.channelFilter(item.contents, 'cbbh')[0];
        }, function(err) { console.error(err) });
    }

    var calculateSegmentDuration = function(start, end, broadcastDuration) {
        return (broadcastDuration - start) - (broadcastDuration - end);
    }

    $scope.generateID = function() {
        return Math.random().toString(36).substr(2, 9);
    }

    // When the selectedItem object changes inside the search directive, then
    // update the UI with the new broadcast data
    $scope.$watch('atlasSearch.selectedItem', function(old_val, new_val) {
        if (!_.isEmpty($scope.atlasSearch.selectedItem)) {
            var _formatted = Helpers.formatResponse($scope.atlasSearch.selectedItem);
            $scope.item = _formatted;
            $scope.episode = $scope.atlasSearch.selectedItem;
            $scope.broadcast = $scope.episode.broadcasts[0];
            $scope.showUI = true;
            $scope.loading = false;
        }
    })

    // Clear the stage of the current item
    $scope.killCurrent = function() {
        $scope.showUI = false;
        $scope.loading = false;
        $scope.item = {};
        $scope.showSegments = {};
        $scope.atlasSearch = {};
        $scope.scrubber = {};
    }

    // Create a new item
    $scope.createNew = function() {
        var _out = {};
        var _showLinks = _.union($scope.showSegments.segments, $scope.scrubber.segments);
        var _atlas = { 
            id: $scope.episode.id,
            uri: $scope.episode.uri
        }
        var _segments = [], _duration;
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

        Scrubbables.create($scope.writeKey, _out)
        .then(function(id) {   
            // after the item has been sent to atlas, clear all the things  
            $scope.showUI = false;
            $scope.loading = false;
            $scope.item = {};
            $scope.showSegments = {};
            $scope.atlasSearch = {};
            $scope.scrubber = {};
            showMessage('The item has been saved');
        }, function(res) {
            console.error(res);
            showMessage('There was a problem sending the item to Atlas');
        });
    }

}]);

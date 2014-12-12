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
            if (item.segment) {
                $scope.showSegments.loadSegments(item.segment);
                $scope.scrubber.loadSegments(item.segments);
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
        console.log(_segments);

        Scrubbables.create($scope.writeKey, _out)
        .then(function(res) {   
            // when the item has been sent to atlas, clear all the things  
            $scope.showUI = false;
            $scope.loading = false;
            $scope.item = {};
            $scope.showSegments = {};
            $scope.atlasSearch = {};
            $scope.scrubber = {};
            showMessage('The item has been saved');
        }, function(res) {
            console.error(res);
            showMessage('There was a peoblem sending the item to Atlas');
        });
    }

}]);



app.directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http', 'GroupsService', 'BBCScrubbablesService', 'ScrubbablesHelpers', '$location',
    function($document, $q, $timeout, atlasHost, $http, Groups, Scrubbables, Helpers, $location) {

    var controller = function($scope, $el, $attr) {
        var $el = $($el);
        var input_timer;
        $scope.atlasSearch = {};
        $scope.atlasSearch.selectedItem = {};
        $scope.atlasSearch.showAutocomplete = false;

        $scope.atlasSearch.selectAtlasItem = function(title, id) {
            var _result;
            $location.path('/scrubbables/'+id);
            //Scrubbables.content.uri(uri).then(function(item) {
            //    _result = Helpers.channelFilter(item.contents, 'cbbh');
            //    $scope.atlasSearch.selectedItem = _result[0]
            //});
            $scope.loading = true;
            $scope.atlasSearch.searchquery = title;
            $scope.atlasSearch.showAutocomplete = false;
        }

        $scope.atlasSearch.messageOutput = function(message) {
            $scope.atlasSearch.showMessage = (typeof message === 'string')? true : false;
            var _messagetpl;
            if ($scope.atlasSearch.showMessage) {
                $scope.atlasSearch.message = message;
                $scope.atlasSearch.showMessage = true;
                $scope.atlasSearch.showAutocomplete = false;
            }else{
                $scope.atlasSearch.message = '';
                $scope.atlasSearch.showMessage = false;
            }
        }

        var searchRequest = function() {
            var _query = $scope.atlasSearch.searchquery;
            if (!_query.length) return;

            Scrubbables.search($scope.searchKey, _query).then(function(res) {
                if (res.contents.length) {
                    var upcoming, result;
                    for (var i in res.contents) {
                        upcoming = res.contents[i].upcoming_content;
                        for (var ii in upcoming) {
                            Scrubbables.content.uri(upcoming[ii].uri).then(
                                function(data) {
                                var result = Helpers.channelFilter(data.contents, 'cbbh');
                                if (_.isObject(result)) {
                                    $scope.atlasSearch.searchResults.push( Helpers.formatResponse(result[0]) );
                                }
                            }, function(err) { console.error(err) });
                        }
                        
                    }
                    $scope.atlasSearch.messageOutput(null);
                    $scope.atlasSearch.showAutocomplete = true;
                }else{
                    $scope.atlasSearch.showAutocomplete = false;
                    $scope.atlasSearch.messageOutput('No results found');
                }
            }, function(err) {
                $scope.atlasSearch.showAutocomplete = false;
                console.error(err)
            })
        }

        $scope.atlasSearch.lookupAtlasItem = function() {
            var _query = $scope.atlasSearch.searchquery;
            $scope.atlasSearch.message = null;
            $scope.atlasSearch.searchResults = [];
            if (!_.isString(_query)) return;

            if (!_query.length) {
                $timeout.cancel(input_timer);
                $scope.atlasSearch.search_results = null;
                $scope.atlasSearch.showAutocomplete = false;
                return;
            }

            if (_query.length > 2 || _query.length == 0) {
                $scope.atlasSearch.messageOutput('Searching...');
                $timeout.cancel(input_timer);
                input_timer = $timeout(searchRequest, 1000);
            }
        }

    }

    return {
        restrict: 'E',
        scope: false,
        link: controller,
        templateUrl: 'partials/bbcScrubbables/atlasSearch.html'
    }
}]);

app.directive('showSegments', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    var createSegmentObj = function(label, uri, startTime, endTime, id) {
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

        $scope.showSegments.loadSegments = function(segment) {
            if (segment.related_links.length) {
                var _segment, _item;
                for (var i in segment.related_links) {
                    _item = segment.related_links[i];
                    _segment = createSegmentObj(_item.title, 
                                                _item.url, 
                                                0, 
                                                segment.duration, 
                                                $scope.generateID());
                    $scope.showSegments.segments.push(_segment);
                    $scope.showSegments.showCreateUI = false;
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
            if (!_.isString($scope.showSegments.newItem.label) || !_.isString($scope.showSegments.newItem.url)) return;
            if ($scope.showSegments.newItem.label === '' || $scope.showSegments.newItem.url === '') return;
            var _segment = createSegmentObj($scope.showSegments.newItem.label, 
                                            $scope.showSegments.newItem.url, 
                                            0, 
                                            $scope.broadcast.duration, 
                                            $scope.generateID());
            $scope.showSegments.segments.push(_segment)
            $scope.showSegments.newItem.label = $scope.showSegments.newItem.url = '';
            $scope.showSegments.showCreateUI = false;
        }
    }

    return {
        restrict: 'E',
        scope: false,
        link: controller,
        templateUrl: 'partials/bbcScrubbables/episodeSegmentPartial.html'
    }
}]);
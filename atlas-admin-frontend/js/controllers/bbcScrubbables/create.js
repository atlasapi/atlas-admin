var app = angular.module('atlasAdmin.controllers.bbcscrubbables', []);

app.controller('CtrlBBCScrubbables', ['$scope', '$rootScope', '$routeParams', '$q', 'BBCScrubbablesService', '$timeout',
    function($scope, $rootScope, $routeParams, $q, Scrubbables, $timeout) {

    $scope.view_title = 'TV linker';
    $scope.showUI = false;
    $scope.item = {};

    $scope.showSegments = {};
    $scope.atlasSearch = {};
    $scope.scrubber = {};

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

    // Seconds -> HHMMSS
    //
    // Converts boring old seconds to object containing 
    // HH MM SS as strings
    //
    // @return {Object} keys: hh, mm, ss
    function secondsToHHMMSS(secs) {
        if (typeof secs !== 'number' && 
            typeof secs !== 'string') {
            return null;
        }
        var _seconds = parseInt(secs, 10);
        var hours = Math.floor(_seconds/3600);
        var minutes = Math.floor((_seconds - (hours*3600)) / 60);;
        var seconds = _seconds - (hours * 3600) - (minutes * 60);
        return {
            hh: (hours < 10) ? '0'+hours : hours.toString(),
            mm: (minutes < 10) ? '0'+minutes : minutes.toString(),
            ss: (seconds < 10) ? '0'+seconds : seconds.toString()
        }
    }

    $scope.generateID = function() {
        return Math.random().toString(36).substr(2, 9);
    }

    // When the selectedItem object changes inside the search directive, then
    // update the UI with the new broadcast data
    $scope.$watch('atlasSearch.selectedItem', function(old_val, new_val) {
        if (!_.isEmpty($scope.atlasSearch.selectedItem)) {
            $scope.episode = $scope.atlasSearch.selectedItem;
            $scope.broadcast = $scope.episode.broadcasts[0];

            if (_.isObject($scope.episode.container)) {
                //$scope.item.nextbroadcast = new Date($scope.broadcast.transmission_time);
                if (($scope.episode.container.type === 'brand' || $scope.episode.container.type === 'series') && !$scope.episode.special) {
                    $scope.item.title = $scope.episode.container.title;
                    $scope.item.subtitle = $scope.episode.title;
                    $scope.item.episode_number = $scope.episode.episode_number;
                }else{
                    $scope.item.title = $scope.episode.title;   
                }
            }else{
                $scope.item.title = $scope.broadcast.title;
                $scope.item.subtitle = false;
                $scope.item.episode_number = false;
            }
            console.log($scope.episode);
            console.log($scope.broadcast);
            $scope.item.duration = secondsToHHMMSS($scope.broadcast.duration);
            $scope.showUI = true;
        }
    })

    $scope.killCurrent = function() {
        $scope.showUI = false;
        $scope.item = {};
        $scope.showSegments = {};
        $scope.atlasSearch = {};
        $scope.scrubber = {};
    }

    $scope.createNew = function() {
        var _out = {};
        var _showLinks = _.union($scope.showSegments.segments, $scope.scrubber.segments);
        var _atlas = { 
            id: $scope.episode.id,
            uri: $scope.episode.uri
        }
        var _segments = [], _duration;
        for (var i in _showLinks) {
            // calculate the duration
            _duration = ($scope.broadcast.duration - _showLinks[i].startTime) - ($scope.broadcast.duration - _showLinks[i].endTime);
            _segments.push({
                title: _showLinks[i].label,
                url: _showLinks[i].url,
                offset: _showLinks[i].startTime,
                duration: _duration
            });
        }
        _out.atlas = _atlas;
        _out.segments = _segments;

        Scrubbables.create('APIKEY', _out)
        .then(function(res) {   
            // when the item has been sent to atlas
            $scope.showUI = false;
            $scope.item = {};
            $scope.showSegments = {};
            $scope.atlasSearch = {};
            $scope.scrubber = {};
            showMessage('The item has been saved');
        }, function(res) {
            console.error(res);
            showMessage('There was a peoblem sending the item to Atlas', 'error');
        });
    }

}]);



app.directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http', 'GroupsService',
    function($document, $q, $timeout, atlasHost, $http, Groups) {

    var atlasSearchRequest = function(apiKey, query) {
        var defer = $q.defer();
        $http.get(atlasHost.replace('stage.', '')+'/3.0/search.json?apiKey='+encodeURIComponent(apiKey)+'&q='+encodeURIComponent(query)+'&limit=10&type=item&annotations=people,description,broadcasts,brand_summary,channel_summary,series_summary,upcoming,related_links&topLevelOnly=false&specialization=tv,film&currentBroadcastsOnly=true&broadcastWeighting=20')
             .success(function(data, status) {
                defer.resolve(data);
             })
             .error(defer.reject);

        return defer.promise;
    }

    // Channel filter
    //
    // Used for filtering atlas search results to only have items broadcast
    // on certain channels
    //
    // @param items {array} atlas search result array
    // @param channel_id {string}
    // @return {array}
    var channelFilter = function(items, channel_id) {
        if (!_.isObject(items) || !_.isString(channel_id)) {
            console.error('channelFilter() -> wrong type')
            return null;
        }
        for (var i=0; items.length > i; i++) {
            _result = _.filter(items[i].broadcasts, function(itm) {
                return (itm.channel.id === channel_id) ? true : false;
            });
            if (_result.length) {
                items[i].broadcasts = _result;
            }else{
                items[i] = null;
            }
        }
        return _.compact(items);
    }

    var requestAtlasContent = function(uri) {
        if (!_.isString(uri)) return null;
        var defer = $q.defer();
        $http.get(atlasHost.replace('stage.', '')+'/3.0/content.json?uri='+encodeURIComponent(uri)+'&annotations=channel,channel_summary,extended_description,brand_summary,broadcasts,series_summary,available_locations,related_links')
             .success(function(data, status) {
                defer.resolve(data);
             })
             .error(defer.reject);

        return defer.promise;
    }

    function parseContent(contentObject) {

    }

    var controller = function($scope, $el, $attr) {
        var $el = $($el);
        var input_timer;
        $scope.atlasSearch = {};
        $scope.atlasSearch.selectedItem = {};
        $scope.atlasSearch.showAutocomplete = false;

        Groups.get().then(function(res) {
            for (var i=0; i<res.length; i++) {
                if (res[i].name === 'BBC-Scrubbables') {
                    $scope.searchKey = res[i].data.searchApiKey;
                }
            }
        })

        $scope.atlasSearch.selectAtlasItem = function(title, uri) {
            var _result;
            requestAtlasContent(uri).then(function(item) {
                _result = channelFilter(item.contents, 'cbbh');
                $scope.atlasSearch.selectedItem = _result[0]
            });
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

        $scope.atlasSearch.lookupAtlasItem = function() {
            var _query = $scope.atlasSearch.searchquery;
            var _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
                input_timer = $timeout(function() {
                    atlasSearchRequest($scope.searchKey, _query).then(function(res) {
                        var _results = channelFilter(res.contents, 'cbbh');
                        if (_results.length) {
                            var item, resultObj;
                            for (var i in _results) {
                                item = _results[i];
                                resultObj = {}
                                resultObj.uri = item.uri;
                                resultObj.title = (item.container.type === 'series' || item.container.type === 'brand')? item.container.title : item.title;

                                if (item.container.brand && new Date(item.title) != 'Invalid Date') {
                                    var _date = new Date(item.title.split('/')[2]+'/'+item.title.split('/')[1]+'/'+item.title.split('/')[0]);
                                    console.log(item.title, _date)
                                    resultObj.subtitle = _date.getDate()+' '+_months[_date.getMonth()]+' '+_date.getFullYear();
                                }else{
                                    resultObj.subtitle = item.title;
                                }

                                $scope.atlasSearch.searchResults.push(resultObj);
                            }
                            $scope.atlasSearch.messageOutput(null);
                            $scope.atlasSearch.showAutocomplete = true;
                        }else{
                            $scope.atlasSearch.showAutocomplete = false;
                            $scope.atlasSearch.messageOutput('No results found');
                        }
                    }, function(reason) {
                        $scope.atlasSearch.showAutocomplete = false;
                        console.error(reason)
                    })
                }, 1000);
            }
        }

    }

    return {
        restrict: 'E',
        scope: false,
        link: controller,
        templateUrl: 'partials/bbcScrubbables/atlasSearch.html'
    }
}])

app.directive('showSegments', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    var controller = function($scope, $el, $attr) {
        var $el = $($el);
        $scope.showSegments = {};
        $scope.showSegments.newItem = {};
        $scope.showSegments.segments = [];
        $scope.showSegments.showCreateUI = false;

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
            var _segment = {
                label: $scope.showSegments.newItem.label,
                url: $scope.showSegments.newItem.url,
                startTime: 0,
                endTime: $scope.broadcast.duration,
                _id: $scope.generateID()
            }
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
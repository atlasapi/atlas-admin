var app = angular.module('atlasAdmin.controllers.bbcscrubbables', []);

app.controller('CtrlBBCScrubbables', ['$scope', '$rootScope', '$routeParams', '$q',
    function($scope, $rootScope, $routeParams, $q) {

    $scope.view_title = 'Scrubbable creator';
    $scope.showUI = false;
    $scope.item = {};

    // Seconds -> HHMMSS
    //
    // Converts boring old seconds to object containing 
    // HH MM SS as strings
    //
    // @returns {Object} keys: hh, mm, ss
    function secondsToHHMMSS (secs) {
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

    $scope.$watch('atlasSearch.selectedItem', function(old_val, new_val) {
        if (!_.isEmpty($scope.atlasSearch.selectedItem)) {
            $scope.episode = $scope.atlasSearch.selectedItem;
            $scope.broadcast = $scope.episode.broadcasts[0];

            if ($scope.episode.type === 'episode' && _.isObject($scope.episode.container)) {
                $scope.item.title = $scope.episode.container.title;
                $scope.item.subtitle = $scope.episode.title;
                $scope.item.episode_number = $scope.episode.episode_number;
            }else{
                $scope.item.title = $scope.broadcast.title;
                $scope.item.subtitle = false;
                $scope.item.episode_number = false;
            }

            $scope.item.duration = secondsToHHMMSS($scope.broadcast.duration);

            console.log($scope.broadcast, $scope.item);

            $scope.showUI = true;
        }
        console.log($scope.episode);
    })

}]);



app.directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    var atlasSearchRequest = function(query) {
        var defer = $q.defer();
        $http.get(atlasHost.replace('stage.', '')+'/3.0/search.json?apiKey=d28dbc8965194fc5acc51aab3e4c3cb7&q='+query+'&limit=10&type=item&annotations=people,description,broadcasts,brand_summary,channel_summary,series_summary,upcoming,related_links&topLevelOnly=false&specialization=tv,film&currentBroadcastsOnly=true&broadcastWeighting=20')
             .success(function(data, status) {
                defer.resolve(data);
             })
             .error(defer.reject);

        return defer.promise;
    }

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
        if (!_.isString(uri)) return;
        var defer = $q.defer();
        $http.get(atlasHost.replace('stage.', '')+'/3.0/content.json?uri='+uri+'&annotations=channel,channel_summary,extended_description,brand_summary,broadcasts,series_summary,available_locations,related_links')
             .success(function(data, status) {
                defer.resolve(data);
             })
             .error(defer.reject);

        return defer.promise;
    }

    var controller = function($scope, $el, $attr) {
        var $el = $($el);
        var input_timer;
        $scope.atlasSearch = {};
        $scope.atlasSearch.showAutocomplete = false;

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
            $scope.atlasSearch.message = null;
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
                    atlasSearchRequest(_query).then(function(res) {
                        var _results = channelFilter(res.contents, 'cbbh');
                        if (_results.length) {
                            $scope.atlasSearch.messageOutput(null);
                            $scope.atlasSearch.search_results = _results;
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
        template: '<div class="search-input"><input type="text" placeholder="Search..." ng-model="atlasSearch.searchquery" ng-change="atlasSearch.lookupAtlasItem()"></div><div ng-show="atlasSearch.showMessage" class="message-output">{{atlasSearch.message}}</div><div ng-show="atlasSearch.showAutocomplete" class="search-completions"><span ng-repeat="result in atlasSearch.search_results" class="search-item" ng-click="atlasSearch.selectAtlasItem(result.title, result.uri)"><strong>{{result.title}}</strong><i>{{result.broadcasts[0].transmission_time}}</i></span></div>'
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
                start_time: 0,
                end_time: $scope.broadcast.duration
            }
            $scope.showSegments.segments.push(_segment)
            console.log($scope.showSegments.segments);
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
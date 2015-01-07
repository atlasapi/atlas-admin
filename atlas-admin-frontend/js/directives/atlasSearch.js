var app = angular.module('atlasAdmin.directives.bbcscrubbables');

app.directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http', 'GroupsService', 'BBCScrubbablesService', 'ScrubbablesHelpers', '$location',
    function($document, $q, $timeout, atlasHost, $http, Groups, Scrubbables, Helpers, $location) {

    var controller = function($scope, $el, $attr) {
        var $el = $($el);
        var input_timer;
        $scope.atlasSearch = {};
        $scope.atlasSearch.selectedItem = {};
        $scope.atlasSearch.showAutocomplete = false;

        $scope.atlasSearch.selectAtlasItem = function(title, id) {
            if (!_.isString(title) && !_.isString(id)) { 
                return false;
            }
            var _result;
            $location.path('/scrubbables/'+id);
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
                    var result, filteredItems;
                    res.contents.forEach(function(item) {
                        Scrubbables.content.uri(item.uri).then(
                            function(contentResult) {
                            result = contentResult.contents[0];
                            if ('upcoming_content' in result) {
                                result.upcoming_content.forEach( function(upcoming) {
                                    Scrubbables.content.uri(upcoming.uri).then(
                                        function(upcomingResult) {
                                        filteredItems = Helpers.channelFilter(upcomingResult.contents, 'cbbh');
                                        if (filteredItems) {
                                            $scope.atlasSearch.searchResults.push( Helpers.formatResponse(filteredItems[0]) );
                                        }
                                    })
                                })
                            }
                        })  
                    })
                    $scope.atlasSearch.messageOutput(null);
                    $scope.atlasSearch.showAutocomplete = true;
                } else {
                    $scope.atlasSearch.messageOutput('No results found');
                    $scope.atlasSearch.showAutocomplete = false;
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
            } else if (_query.length > 2) {
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
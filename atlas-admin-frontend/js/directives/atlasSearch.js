var app = angular.module('atlasAdmin.directives.bbcscrubbables');

app.directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http', 'GroupsService', 'BBCScrubbablesService', 'ScrubbablesHelpers', '$location',
function($document, $q, $timeout, atlasHost, $http, Groups, Scrubbables, Helpers, $location) {
  
  var controller = function($scope, $el) {
    $el = $($el);
    var input_timer;
    $scope.atlasSearch = {};
    $scope.atlasSearch.selectedItem = {};
    $scope.atlasSearch.showAutocomplete = false;
    
    $scope.atlasSearch.selectAtlasItem = function(title, id) {
      if (!_.isString(title) && !_.isString(id)) { 
        return false;
      }
      $location.path('/scrubbables/'+id);
      $scope.loading = true;
      $scope.atlasSearch.searchquery = title;
      $scope.atlasSearch.showAutocomplete = false;
    };
    
    $scope.atlasSearch.messageOutput = function(message) {
      $scope.atlasSearch.showMessage = (typeof message === 'string') ? true : false;
      if ($scope.atlasSearch.showMessage) {
        $scope.atlasSearch.message = message;
        $scope.atlasSearch.showMessage = true;
        $scope.atlasSearch.showAutocomplete = false;
      }else{
        $scope.atlasSearch.message = '';
        $scope.atlasSearch.showMessage = false;
      }
    };
    
    var searchRequest = function() {
      var _query = $scope.atlasSearch.searchquery;
      if (!_query.length) {
        return;
      }
      
      var getContentForUri = function(uri) {
        var defer = $q.defer();
        if (!_.isString(uri)) {
          defer.reject(new Error('URI arg should be a string'));
          return defer.promise;
        }
        Scrubbables.content.uri($scope.searchKey, uri).then(function(item) {
          defer.resolve(item.contents[0]);
        });
        return defer.promise;
      };
      
      Scrubbables.search($scope.searchKey, _query).then(function(res) {
        if (! _.has(res.contents[0], 'broadcasts')) {
          console.warn('Result content has no broadcasts');
          return false;
        }
        
        var broadcasts = res.contents[0].broadcasts || null;
        if (broadcasts) {
          broadcasts = _.filter(res.contents[0].broadcasts, function(bcast) {
            var channelId = bcast.channel.id || '';
            if (channelId.toLowerCase() === 'cbbh') {
              return true;
            }
          });
          
          // When the broadcast cant be found on the original correct channel, look
          // inside the variations array
          if (_.isEmpty(broadcasts)) {
            broadcasts = _.filter(res.contents[0].broadcasts, 
            function (bcast) {
              if (! _.isArray(bcast.channel.parent.variations)) {
                return false;
              }
              var variations = bcast.channel.parent.variations;
              _.forEach(variations, function (variant) {
                if (variant.id.toLowerCase() === 'cbbh') {
                  return true;
                }
              });
            });
          }
          
          if (! _.isEmpty(broadcasts)) {
            getContentForUri(res.contents[0].uri).then(
              function(contents) {
                $scope.atlasSearch.searchResults.push( Helpers.formatResponse(contents) );
                $scope.atlasSearch.messageOutput(null);
                $scope.atlasSearch.showAutocomplete = true;
              }, function(err) { console.error(err); });
            }else{
              $scope.atlasSearch.messageOutput('No results found');
              $scope.atlasSearch.showAutocomplete = false;
            }
          }else{
            $scope.atlasSearch.messageOutput('No results found');
            $scope.atlasSearch.showAutocomplete = false;
          }
        }, function() {
          $scope.atlasSearch.showAutocomplete = false;
        });
      };
      
      $scope.atlasSearch.lookupAtlasItem = function() {
        var _query = $scope.atlasSearch.searchquery;
        $scope.atlasSearch.message = null;
        $scope.atlasSearch.searchResults = [];
        
        if (!_.isString(_query)) {
          return;
        }
        
        if (! _query.length) {
          $timeout.cancel(input_timer);
          $scope.atlasSearch.search_results = null;
          $scope.atlasSearch.showAutocomplete = false;
        } else if (_query.length > 2) {
          $scope.atlasSearch.messageOutput('Searching...');
          $timeout.cancel(input_timer);
          input_timer = $timeout(searchRequest, 1000);
        }
      };
      
    };
    
    return {
      restrict: 'E',
      scope: false,
      link: controller,
      templateUrl: 'partials/bbcScrubbables/atlasSearch.html'
    };
  }]);

var app = angular.module('atlasAdmin.controllers.bbcscrubbables', []);

app.controller('CtrlBBCScrubbables', ['$scope', '$rootScope', '$routeParams', '$q',
    function($scope, $rootScope, $routeParams, $q) {

    $scope.view_title = 'Scrubbable creator';

}]);


app.directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    var atlasSearchRequest = function(query) {
        var defer = $q.defer();
        $http.get(atlasHost.replace('stage.', '')+'/3.0/search.json?publisher=bbc.co.uk&q='+query+'&limit=20')
             .success(function(data, status) {
                console.log(data.contents);
                defer.resolve(data);
             })
             .error(defer.reject);

        return defer.promise;
    }

    var lookupAtlasItem = function(id) {
        if (!_.isString(id)) return;
        var defer = $q.defer();
        $http.get(atlasHost.replace('stage.', '')+'/3.0/search.json?channel_id=cbbh&publisher=bbc.co.uk&q='+query+'&limit=5')
             .success(function(data, status) {
                console.log(data.contents);
                defer.resolve(data);
             })
             .error(defer.reject);

        return defer.promise;
    }

    var controller = function($scope, $el, $attr) {
        var input_timer;
        $scope.showAutocomplete = false;

        $scope.selectAtlasItem = function(title, id) {
            $scope.searchquery = title;
            $scope.showAutocomplete = false;
        }

        $scope.lookupAtlasItem = function() {
            var _query = $scope.searchquery;
            if (!_.isString(_query)) return;

            if (!_query.length) {
                $scope.search_results = null;
                $scope.showAutocomplete = false;
                return;
            }

            if (_query.length > 2 || _query.length == 0) {
                $timeout.cancel(input_timer);
                input_timer = $timeout(function() {
                    atlasSearchRequest(_query).then(function(res) {
                        $scope.showAutocomplete = true;
                        $scope.search_results = res.contents;
                    }, function(reason) {
                        $scope.showAutocomplete = false;
                        console.error(reason)
                    })
                }, 1000);
            }
        }
    }

    return {
        link: controller,
        template: '<div class="search-input"><input type="text" placeholder="Search..." ng-model="searchquery" ng-change="lookupAtlasItem()"></div><div ng-show="showAutocomplete" class="search-completions"><span ng-repeat="result in search_results" class="search-item" ng-click="selectAtlasItem(result.title, result.id)">{{result.title}}</span></div>'
    }
}])
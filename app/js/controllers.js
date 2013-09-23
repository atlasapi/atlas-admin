'use strict';

/* Controllers */

angular.module('atlasAdmin.controllers', []).
  controller('CtrlSources', function($scope, $rootScope, $routeParams) {
      $rootScope.title = "Sources";
      $rootScope.showFilter = true;
  })
  .controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams) {
      $rootScope.title = "Source :::";
      $rootScope.showFilter = true;
  })
  .controller('CtrlRequests', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Requests";
  })
  .controller('CtrlApplications', function($scope, $rootScope, $routeParams) {
     $rootScope.title = "Applications";
  });



var aaContainer = function($scope) {
    // $scope.title = "Atlas Applications";
}  



var sourcesPage = function($scope, $routeParams, $http, atlasHost) {
  // $scope.sources = AllSources.query();
    $http.jsonp(atlasHost + '/sources.json?callback=JSON_CALLBACK').success(function(data) {
        $scope.sources = data.sources;
        
    });
};

var sourceReadersPage = function($scope, $rootScope, $routeParams, $http, atlasHost) {
  // $scope.sources = AllSources.query();
    $http.jsonp(atlasHost + '/sources.json?id=' + $routeParams.sourceId + '&callback=JSON_CALLBACK').success(function(data) {
        $rootScope.title = data.sources[0].name;
        
    });
    
    var url = atlasHost + '/applications.json?callback=JSON_CALLBACK'; // ?source.reads=' + $routeParams.sourceId + '&
    $http.jsonp(url).success(function(data) {
        var applications = [];
        for (var i in data.applications) {
            var application = {
                "id": data.applications[i].id,
                "title": data.applications[i].title,
                "created": data.applications[i].created
            };
            // find source
            for (var j in data.applications[i].sources.reads) {
                if (data.applications[i].sources.reads[j].id == $routeParams.sourceId) {
                    application.state = data.applications[i].sources.reads[j].state;
                    application.enabled = data.applications[i].sources.reads[j].enabled;
                }
            }
            applications.push(application);
        }
        
        $scope.applications = applications;
        
    });
};



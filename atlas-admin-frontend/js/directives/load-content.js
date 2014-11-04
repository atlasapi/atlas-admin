'use strict';
var app = angular.module('atlasAdmin.directives.loadContent', []);

app.directive('loadContent', ['$document', 'FeedsService', '$q',
    function($document, Feeds, $q) {
    var _loaded = false;
    var loadContent = function(content) {
        var defer = $q.defer();
        if (!_loaded) {
            Feeds.request('youview/bbc_nitro?uri='+content).then(function(xmlData){
                defer.resolve(xmlData);
                _loaded = true;
            });
        }else{
            defer.reject(null);
        }
        return defer.promise;
    }

    var controller = function($scope, element, attr) {
        var _content = attr.content,
            $el = $(element);

        $scope.showData = false;

        $('.loadData', $el).on('click', function() {
            loadContent(_content).then(function(xml) {
                $scope.xml = xml;
                $scope.showData = true;
            });
        })
    }

    return {
        template: '<header>{{content}}<span class="button small loadData">Show data</span></header><div ng-show="showData" class="xml-data"><code>{{xml}}</code></div>',
        link: controller
    } 
}]);
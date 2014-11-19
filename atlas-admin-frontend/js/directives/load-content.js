'use strict';
var app = angular.module('atlasAdmin.directives.loadContent', []);

app.directive('loadContent', ['$document', 'FeedsService', '$q', '$sce',
    function($document, Feeds, $q, $sce) {

    var escapeHtml = function(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }

    var formatXml = function(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }
            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '&nbsp;&nbsp;';
            }
            formatted += '<div>' + padding + escapeHtml(node) + '</div>';
            pad += indent;
        });

        return formatted;
    }

    var _loaded = false;
    var loadContent = function(content) {
        var defer = $q.defer();
        if (!_loaded) {
            Feeds.request('youview/bbc_nitro.xml?uri='+content).then(function(xmlData){
                defer.resolve(xmlData);
                _loaded = true;
            });
        }else{
            defer.reject(null);
        }
        return defer.promise;
    }

    var controller = function($scope, element, attr) {
        var _content = attr.content;
        var $el = $(element);
        $scope.showData = false;

        $('.loadData', $el).on('click', function() {
            var _this = $(this);
            _this.text('Loading data...');
            loadContent(_content).then(function(xml) {
                var formattedXML = formatXml(xml);
                $scope.trustedXML = $sce.trustAsHtml(formattedXML);
                $scope.showData = true;
                _this.text('Hide data');
                _this.on('click', function() {
                    if ($scope.showData) {
                        _this.text('Show data');
                    }else{
                        _this.text('Hide data');
                    }
                    $scope.showData = !$scope.showData;
                })
            });
        })
    }

    return {
        template: '<header><h2>{{content}}</h2><span class="button small loadData">Show data</span></header><div ng-show="showData" class="xml-data"><code ng-bind-html="trustedXML"></code></div>',
        link: controller
    } 
}]);
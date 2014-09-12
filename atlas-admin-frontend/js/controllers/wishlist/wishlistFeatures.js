'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistFeatures', ['$scope', '$rootScope', '$routeParams', '$q', 
    function ($scope, $rootScope, $routeParams, $q) {
    var root = $rootScope;
    $scope.features = {};

    root.$watch('wishlist', function(new_val, old_val) {
        $scope.features = _.filter($rootScope.wishlist, function(n) {
            return n.type === 'feature';
        })
    });
}]);

app.directive('featureRow', ['$document', function($document) {
    return function(scope, $el, attr) {
        var context = _.filter(scope.$parent.features, function(n) {
            return n._id === attr.featureRow;
        })[0];

        var title = context.title || '';
        var feature = context.feature || {description: ''};

        // template
        $el.html( '<td class="feature-item">'+
                      '<div class="feature-name">'+title+'</div>'+
                      '<div class="feature-options"><span class="button tell-me-more">Tell me more</span></div>'+
                      '<div class="feature-detail panel-full" ng-hide>'+
                          '<div class="panel-half"><p>'+feature.description+'</p></div>'+
                          '<div class="panel-half"></div>'+
                      '</div>'+
                  '</td>' );

        // when user clicks 'tell me more' button, open the 
        $('.tell-me-more.button', $el).on('click', function() {

        });
    }
}]);
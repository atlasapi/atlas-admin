'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistFeatures', ['$scope', '$rootScope', '$routeParams', 'factoryWishlist', '$q', 
    function ($scope, $rootScope, $routeParams, Wishlist, $q) {
    var root = $rootScope;
    $scope.features = {};
    $scope.asked = {};

    root.$watch('wishlist', function(new_val, old_val) {
        $scope.features = _.filter($rootScope.wishlist, function(n) {
            return n.type === 'feature';
        })
    });

    // when user wish data changes, only allow source wishes to be 
    // filtered into the $scope
    root.$watch('wishes', function(new_val, old_val) {
        $scope.asked = _.filter(root.wishes, function(n) {
            return n.wish.type === 'feature';
        })
    });


    $scope.user_has = function(item_id) {
        var t = _.filter($scope.asked, {wish: { _id: item_id }});
        return t.length > 0;
    }

    $scope.use = function(featureId) {
        var item = _.filter($scope.features, function(n) {
            return n._id === featureId;
        })[0]

        if ('object' !== typeof item) throw new TypeError(); 

        var postdata = {
            wish: item,
            reason: ''
        }

        Wishlist.createWish(postdata).then(function(data) {
            $scope.asked.push(data);
        });
    }
}]);

app.directive('featureRow', ['$document', function($document) {
    var template = 
            '<td class="feature-item">'+
                '<div class="feature-name">{{feature.title}}</div>'+
                '<div class="feature-options"><span class="button tell-me-more">Tell me more</span></div>'+
                '<div class="feature-detail panel-full">'+
                    '<div class="panel-half"><p>{{feature.feature.description}}</p></div>'+
                    '<div class="panel-half"><div ng-if="!user_has(feature._id)" ng-click="use(feature._id)" class="use-this">I\'d use this</div></div>'+
                '</div>'+
            '</td>';

    return {
        scope: false,
        template: template
    }
}]);
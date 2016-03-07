'use strict';

var app = angular.module('atlasAdmin.wishlist');

app.controller('CtrlWishlistSources', ['$scope', '$rootScope', '$routeParams', 'factoryWishes', '$q',
    function ($scope, $rootScope, $routeParams, Wishes, $q) {
    var root = $rootScope;
    $scope.sources = [];
    $scope.asked = [];

    // when wishlist data changes, only allow sources to be filtered
    // into the $scope
    root.$watch('wishlist', function(new_val, old_val) {
        $scope.sources = _.filter(root.wishlist, function(n) {
            return n.type === 'source';
        })
    });

    // when user wish data changes, only allow source wishes to be
    // filtered into the $scope
    root.$watch('wishes', function(new_val, old_val) {
        $scope.asked = _.filter(root.wishes, function(n) {
            return n.wish.type === 'source';
        })
    });

    $scope.user_has = function(item_id) {
        var t = _.filter($scope.asked, {wish: { _id: item_id }});
        return t.length > 0;
    }

    // create a new wish
    $scope.make_wish = function(item_id, reason) {
        var item = _.filter($scope.sources, function(n) {
            return n._id === item_id;
        })[0];
        if ('object' !== typeof item) return false;
        var postdata = {
            wish: item,
            reason: reason
        }
        Wishes.create(postdata).then(function(data) {
            $scope.asked.push(data);
        });
    }
}]);

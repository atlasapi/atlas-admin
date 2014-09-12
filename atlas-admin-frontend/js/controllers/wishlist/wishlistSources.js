'use strict';

var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistSources', ['$scope', '$rootScope', '$routeParams', 'factoryWishlist', '$q', 
    function ($scope, $rootScope, $routeParams, Wishlist, $q) {
    var root = $rootScope;
    $scope.sources = {};
    $scope.asked = {};

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

        Wishlist.createWish(postdata).then(function(data) {
            $scope.asked.push(data);
        });
    }

}]);


app.directive('inputMorph', ['$document', function($document) {
    return function(scope, $el, attr) {
        var context = _.filter(scope.$parent.sources, function(n) {
            return n._id === attr.inputMorph;
        })[0];

        // template
        $el.html( '<span class="button-state button medium stroke">I want this</span>'+
                      '<div class="form-state">'+
                          '<input type="text" name="reason" class="flush-right" placeholder="Briefly, why do you want access to '+context.title+'?">'+
                          '<span class="button small left-flush">ok</span>'+
                      '</div>' );

        // switch state on click
        $('.button-state', $el).on('click', function() {
            $('.button-to-input').removeClass('input-mode');
            $(this).parent().addClass('input-mode');
            $('input', this).focus();
        })

        // submit request
        $('.form-state .button', $el).on('click', function() {
            var reason = $('.form-state input', $el).val() || '';
            if (reason.length > 3) {
                scope.$parent.make_wish(context._id, reason);
            }else{
                console.error('Reason not long enough')
            }
        })
    }
}]);
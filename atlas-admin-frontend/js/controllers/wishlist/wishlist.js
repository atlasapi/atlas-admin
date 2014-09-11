'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist', []);

app.controller('CtrlWishlist', ['$scope', '$rootScope', '$routeParams', 'factoryWishlist', 'Users', '$q', 
    function ($scope, $rootScope, $routeParams, Wishlist, Users, $q) {

    // tab state (sources | features)
    $rootScope.currentTab = 'sources';

    // request wishes for current user and inject into rootScope
    Wishlist.getUserWishes().then(function(data) {
        $rootScope.wishes = data;
    })

    // request all wishlist data and inject into rootScope
    Wishlist.all().then(function(data) {
        $rootScope.wishlist = data;
    }, 
    function(msg) { console.error(msg) });
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
            var reason = $('.form-state input', $el).val() || null;
            if (reason.length > 3) {
                scope.$parent.make_wish(context._id, reason);
            }else{
                console.log('no')
            }
        })
    }
}]);
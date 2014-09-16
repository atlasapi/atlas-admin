'use strict';
var app = angular.module('atlasAdmin.controllers.admins.manageWishlist', []);

// date helpers
var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

// instantiate a modal window 
var newSourceItem = function(type) {
    if (type !== 'source' || type !== 'feature') return false;
    $scope.modal = {};
    $scope.modal.type = type;
    $scope.modal.title = "Add new source";
    var modalInstance = $modal.open({
        templateUrl: 'partials/admins/wishlist/newItemModal.html',
        controller: 'CtrlNewWishlistItemModal',
        scope: $scope
    })
    .result.then(function(data) {
        $scope.sources.push(data);
    });
}


app.controller('CtrlManageWishlist', ['$scope', '$rootScope', 'factoryWishlist',
    function($scope, $rootScope, Wishlist) {
    $scope.app = {};
    $rootScope.requestsToday = {};
    $rootScope.currentTab = 'source-requests'

    Wishlist.getAllWishes().then(function(data, status) {
        $rootScope.wishes = data;
    }, function(err) { console.error(err) });

    Wishlist.all().then(function(data, status) {
        $rootScope.items = data;
    }, function(err) { console.error(err) });
}])


app.controller('CtrlManageWishlistSourceRequests', [ '$scope', '$rootScope', 'factoryWishlist',
    function($scope, $rootScope, Wishlist) {

    // filter out source wishes, then pass to the $scope
    $rootScope.$watch('wishes', function(old_val, new_val) {
        $scope.sourceWishes = _.filter($rootScope.wishes, function(n) {
            return n.wish.type === 'source';
        });
        $scope.sources_by_count = _.countBy($scope.sourceWishes, function(n) {
            return n.wish.title;
        });
        // map out number of requests from today
        $rootScope.requestsToday.sources = _.map($scope.sourceWishes, function(n) {
            if (dateFromObjectId(n._id) > yesterday) return n;
        }).length;
    });
}])


app.controller('CtrlManageWishlistFeatureRequests', [ '$scope', '$rootScope', 'factoryWishlist',
    function($scope, $rootScope, Wishlist) {

    // filter out feature wishes, then pass to the $scope
    $rootScope.$watch('wishes', function(old_val, new_val) {
        $scope.featureWishes = _.filter($rootScope.wishes, function(n) {
            return n.wish.type === 'feature';
        });
        $scope.features_by_count = _.countBy($scope.featureWishes, function(n) {
            return n.wish.title;
        });

        // map out number of requests from today
        $rootScope.requestsToday.features = _.map($scope.featureWishes, function(n) {
            if (dateFromObjectId(n._id) > yesterday) return n;
        }).length;
    });
}])


app.controller('CtrlManageWishlistSources', ['$scope', '$rootScope', 'factoryWishlist', '$modal',
    function($scope, $rootScope, Wishlist, $modal) {

    // filter out source wishes, then pass to the $scope
    $rootScope.$watch('items', function(old_val, new_val) {
        $scope.sources = _.filter($rootScope.items, function(n) {
            return n.type === 'source';
        });
    });

    // instantiate a modal window 
    $scope.newSourceItem = function() {
        $scope.modal = {};
        $scope.modal.type = 'Source' ;
        $scope.modal.title = "Add new source";

        var modalInstance = $modal.open({
            templateUrl: 'partials/admins/wishlist/newItemModal.html',
            controller: 'CtrlNewWishlistItemModal',
            scope: $scope
        })
        .result.then(function(data) {
            $scope.sources.push(data);
        });
    }
}])


app.controller('CtrlManageWishlistFeatures', ['$scope', '$rootScope', 'factoryWishlist', '$modal',
    function($scope, $rootScope, Wishlist, $modal) {

    // filter out source wishes, then pass to the $scope
    $rootScope.$watch('items', function(old_val, new_val) {
        $scope.features = _.filter($rootScope.items, function(n) {
            return n.type === 'feature';
        });
    });

    // instantiate a modal window 
    $scope.newFeatureItem = function() {
        $scope.modal = {};
        $scope.modal.type = 'Feature' ;
        $scope.modal.title = "Add new feature";

        var modalInstance = $modal.open({
            templateUrl: 'partials/admins/wishlist/newItemModal.html',
            controller: 'CtrlNewWishlistItemModal',
            scope: $scope
        })
        .result.then(function(data) {
            $scope.features.push(data);
        });
    }
}])


app.controller('CtrlNewWishlistItemModal', ['$scope', '$rootScope', '$modalInstance', 'factoryWishlist',
    function($scope, $rootScope, $modalInstance, Wishlist) {
    $scope.formdata = {};
    $scope.formdata.status = 'not available';
    $scope.submit = function() {
        if ('string' !== typeof $scope.formdata.name
            && 'string'!== typeof $scope.formdata.status) {
            return false;
        } 
        var data = {
            "type": $scope.modal.type.toLowerCase(),
            "title": $scope.formdata.name,
            "status": $scope.formdata.status
        }
        Wishlist.createWishlistItem(data).then(function(data) {
            $modalInstance.close(data);
        });
    }
    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
}])


app.directive('deleteitem', ['$document', 'factoryWishlist', 
    function factory($document, Wishlist) {
    var definitionObj = {
        link: function(scope, $el, attr) {
            $el.on('click', function() {
                var itemId = attr.deleteitem;
                if ('string' === typeof itemId) {
                    scope.$apply(function() {
                        _.remove(scope.$parent.sources, function(n) {
                            return n._id === itemId;
                        });
                    })
                    Wishlist.removeWishlistItem(itemId);
                }
            })
        }
    }
    return definitionObj;
}])


app.directive('changestatus', ['$document', 'factoryWishlist', 
    function factory($document, Wishlist) {
    var definitionObj = {
        link: function(scope, $el, attr) {
            $el.on('click', function() {
                var itemId = attr.id;
                var status = attr.changestatus;
                var parentClassRegex = new RegExp('\\b' + 'state-' + '.+?\\b', 'g'); 
                if ('string' === typeof itemId && 'string' === typeof status) {
                    $el.parent().children().removeClass('active');
                    $el.addClass('active');
                    Wishlist.updateWishlistItemStatus(itemId, status);
                }
            })
        }
    }
    return definitionObj;
}])
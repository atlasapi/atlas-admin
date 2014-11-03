'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.view_title = 'Feeds Console'

    Feeds.request('youview/bbc_nitro/transactions.json')
    .then(function(data) {
        $scope.transactions = data.transactions;
        console.log(data);
    });

    Feeds.request('youview/bbc_nitro/statistics.json')
    .then(function(data) {
        $scope.statistics = data;
        console.log(data);
    });
}])
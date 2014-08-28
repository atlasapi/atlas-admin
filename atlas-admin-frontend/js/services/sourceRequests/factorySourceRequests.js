var app = angular.module('atlasAdmin.services.sourceRequests');

app.factory('factorySourceRequests', ['$http', function($http) {
    var url = 'http://localhost:9000/api/sourceRequest';

    var post = function(data) {
        $http({
            method: 'post',
            url: url,
            data: data
        })
        .success(function(data, status) {
            return status;
        });
    }
    
    return {
        post: post,
        get: function() {}
    };
}]);

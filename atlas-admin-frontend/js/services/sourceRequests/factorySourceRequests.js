var app = angular.module('atlasAdmin.services.sourceRequests');

app.factory('factorySourceRequests', ['$http', '$q', function($http, $q) {
    var defer = $q.defer();
    var url = 'http://localhost:9000/api/sourceRequest';

    var post = function(data) {
        var promise = defer.promise;
        $http({
            method: 'post',
            url: url,
            data: data
        })
        .success(function(data, status) {
            defer.resolve(status);
        });
        return promise;
    }
    
    return {
        post: post,
        get: function() {}
    };
}]);

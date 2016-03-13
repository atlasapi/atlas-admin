'use strict';

angular.module('atlasAdmin.services.bbcRedux')
  .service('bbcRedux', ['atlasHost', '$http', 'GroupsService', '$q',
    function(atlasHost, $http, Groups, $q) {

    var getAuthDetails = function() {
        var defer = $q.defer();
        var _user = null;
        var _pass = null;
        Groups.get().then(function(res) {
            for (var i in res) {
                if (res[i].name === 'BBC-Scrubbables') {
                    _user = res[i].data.redux_user;
                    _pass = res[i].data.redux_pass;
                    break;
                }
            }
            defer.resolve([_user, _pass]);
        })
        return defer.promise;
    }

    var getToken = function() {
        var defer = $q.defer();
        getAuthDetails().then(function(auth) {
            var _postdata = {username: auth[0], password: auth[1]};
            $http.post('https://i.bbcredux.com/user/login', _postdata)
            .success(defer.resolve);
        })
        return defer.promise;
    }

    return {
        getToken: getToken
    }
}]);

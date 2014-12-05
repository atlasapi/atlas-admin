var app = angular.module('atlasAdmin.directives.bbcscrubbables');

app.directive('reduxVideo', ['$document', 'GroupsService', '$q', '$http',
    function($document, Groups, $q, $http) {

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
            defer.resolve(_user, _pass);
        })
        return defer.promise;
    }

    var getToken = function() {
        getAuthDetails().then(function(user, pass) {
            var _postdata = {username: user, password: pass};
            $http.post('https://i.bbcredux.com/user/login').success(function() {

            })
        })
    }

    var controller = function($scope, $el, $attr) {
        getAuthDetails()
    }

    return {
        template: '<div class="scrubbables-video"></div>',
        link: controller,
        scope: false
    }
}])
var app = angular.module('atlasAdmin.interceptors');

// Make sure profile is completed before allowing use of app
app.factory('ProfileCompleteInterceptor', ['ProfileStatus', '$location', '$q', '$rootScope',
    function (ProfileStatus, $location, $q, $rootScope) {
    return {
        'request': function(config) {
            if (ProfileStatus.isProfileComplete()) {
                return config;
            }else{
                $location.path('/profile');
                return config || $q.reject(config);
            }
        },
        'response': function(response) {
            return response || $q.reject(response);
        }
    }

    // return function (promise) {
    //     return promise.then(
    //         function (response) {
    //             var url = response.config.url;
    //             if (url.indexOf('partials/error') !== -1) {
    //                 return response;
    //             }
    //             if (ProfileStatus.isProfileComplete() ||
    //                 response.status === 400 ||
    //                 response.config.url.indexOf('/auth/') !== -1) {
    //                 return response;
    //             }
    //             if (url.indexOf('partials/request') !== -1 ||
    //                 url.indexOf('partials/source') !== -1 ||
    //                 url.indexOf('partials/application') !== -1) {

    //                 if (!ProfileStatus.isProfileComplete()) {
    //                     $location.path('/terms');
    //                     return $q.reject(response);
    //                 }
    //             }
    //             return response;
    //         },
    //         function (response) {
    //             return response;
    //         }
    //     );
    // };
}]);


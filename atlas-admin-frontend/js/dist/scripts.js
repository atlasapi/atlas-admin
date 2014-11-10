'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('atlasAdmin', [
                                'atlasAdmin.filters', 
                                'atlasAdmin.services.auth',
                                'atlasAdmin.services.atlas',
                                'atlasAdmin.services.applications',
                                'atlasAdmin.services.sources',
                                'atlasAdmin.services.sourceRequests',
                                'atlasAdmin.services.sourceLicenses',
                                'atlasAdmin.services.users', 
                                'atlasAdmin.services.uservideosources',
                                'atlasAdmin.services.uservideosources.youtube',
                                'atlasAdmin.services.propositions',
                                'atlasAdmin.services.usage',
                                'atlasAdmin.services.feeds',
                                'atlasAdmin.directives.orderable', 
                                'atlasAdmin.directives.focus',
                                'atlasAdmin.directives.activePath',
                                'atlasAdmin.directives.validUsage',
                                'atlasAdmin.directives.inputmorph',
                                'atlasAdmin.directives.loadContent',
                                'atlasAdmin.controllers.auth',
                                'atlasAdmin.controllers.atlas',
                                'atlasAdmin.controllers.errors',
                                'atlasAdmin.controllers.applications',
                                'atlasAdmin.controllers.wishlist',
                                'atlasAdmin.controllers.sources',
                                'atlasAdmin.controllers.requestSource',
                                'atlasAdmin.controllers.sourceRequests',
                                'atlasAdmin.controllers.user',
                                'atlasAdmin.controllers.epgWidget',
                                'atlasAdmin.controllers.feeds',
                                'atlasAdmin.controllers.uservideosources',
                                'atlasAdmin.controllers.uservideosources.youtube',
                                'atlasAdmin.controllers.admins.usage',
                                'atlasAdmin.controllers.admins.manageSourceRequests',
                                'atlasAdmin.controllers.admins.manageWishlist',
                                'ui.bootstrap',
                                'ngResource',
                                'ngRoute',
                                'atlasAdminConfig']);
app.config(['$routeProvider', function($routeProvider) {
    // admin only routes
    $routeProvider.when('/manage/requests', {templateUrl: 'partials/admins/manageSourceRequests.html', controller: 'CtrlManageSourceRequests'});
    $routeProvider.when('/manage/sources', {templateUrl: 'partials/admins/sources.html', controller: 'CtrlSources'});
    $routeProvider.when('/manage/sources/:sourceId/readers', {templateUrl: 'partials/admins/sourceReaders.html', controller: 'CtrlSourceReaders'});
    $routeProvider.when('/manage/sources/:sourceId/writers', {templateUrl: 'partials/admins/sourceWriters.html', controller: 'CtrlSourceWriters'});
    $routeProvider.when('/manage/users', {templateUrl: 'partials/admins/users.html', controller: 'AllUsersController'});
    $routeProvider.when('/manage/users/:uid', {templateUrl: 'partials/profile.html', controller: 'UserProfileController'});
    $routeProvider.when('/manage/wishlist', {templateUrl: 'partials/admins/wishlist/manageWishlist.html', controller: 'CtrlManageWishlist'});
    $routeProvider.when('/manage/usage', {templateUrl: 'partials/admins/usage/requests.html', controller: 'CtrlUsage'});

    // Add blackout widget page
    $routeProvider.when('/epg/bt-tv', {templateUrl: 'partials/epg-widget.html', controller: 'CtrlEPGWidget'});

    // application user routes
    $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'CtrlApplications'});
    $routeProvider.when('/applications/:applicationId', {templateUrl: 'partials/applicationEdit.html', controller: 'CtrlApplicationEdit'});
    $routeProvider.when('/applications/:applicationId/requestSource/:sourceId', {templateUrl: 'partials/requestSource.html', controller: 'CtrlRequestSource'});
    $routeProvider.when('/wishlist', {templateUrl: 'partials/wishlist/wishlist.html', controller: 'CtrlWishlist'})
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'CtrlLogin'});
    $routeProvider.when('/login/:providerNamespace', {templateUrl: 'partials/login.html', controller: 'CtrlLogin'});
    $routeProvider.when('/oauth/:providerNamespace', {templateUrl: 'partials/oauth.html', controller: 'CtrlOAuth', reloadOnSearch: false});
    $routeProvider.when('/terms', {templateUrl: 'partials/terms.html', controller: 'UserLicenseController'});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'UserProfileController'});
    $routeProvider.when('/feeds', {templateUrl: 'partials/feeds/feeds.html', controller: 'CtrlFeeds'});
    $routeProvider.when('/feeds/:feedId', {templateUrl: 'partials/feeds/console.html', controller: 'CtrlFeedsConsole'});
    $routeProvider.when('/feeds/:feedId/:transactionId', {templateUrl: 'partials/feeds/breakdown.html', controller: 'CtrlFeedsBreakdown'});
    $routeProvider.when('/videosource/providers', {templateUrl: 'partials/videoSourceProviders.html', controller: 'CtrlVideoSourceProviders'});
    $routeProvider.when('/videosource/config/youtube', {templateUrl: 'partials/videoSourceYouTubeConfig.html', controller: 'CtrlVideoSourceYouTubeConfig'});
    $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'CtrlLogout'});
    $routeProvider.when('/error', {templateUrl: 'partials/error.html', controller: 'ErrorController', reloadOnSearch: false});
    $routeProvider.otherwise({redirectTo: '/applications'});
  }])
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
    $httpProvider.responseInterceptors.push('ProfileCompleteInterceptor');
    // loading notifications
    var $http,
    interceptor = ['$q', '$injector', function ($q, $injector) {
        var rootScope;

        function success(response) {
            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // get $rootScope via $injector because of circular dependency problem
                rootScope = rootScope || $injector.get('$rootScope');
                if (!rootScope.show) {
                    rootScope.show = {};
                }
                rootScope.show.load = false;
            }
            return response;
        }

        function error(response) {
            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // get $rootScope via $injector because of circular dependency problem
                rootScope = rootScope || $injector.get('$rootScope');
                if (!rootScope.show) {
                    rootScope.show = {};
                }
                rootScope.show.load = false;
            }
            return $q.reject(response);
        }

        return function(promise) {
            // get $rootScope via $injector because of circular dependency problem
            rootScope = rootScope || $injector.get('$rootScope');
            if (!rootScope.show) {
              rootScope.show = {};
            }
            rootScope.show.load = true;
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.metabroadcast.com/**'
        ]);
}]);

app.config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(false).hashPrefix('!');
}]);

'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.auth', []);

app.factory('Authentication', function ($rootScope, ProfileStatus) {
    if (!$rootScope.status) {
        $rootScope.status = {};
    }
    return {
        getProvider: function () {
            return localStorage.getItem('auth.provider');
        },
        setProvider: function (provider) {
            localStorage.setItem('auth.provider', provider);
        },
        getToken: function () {
            return localStorage.getItem('auth.token');
        },
        setToken: function (token) {
            localStorage.setItem('auth.token', token);
        },
        reset: function () {
            localStorage.removeItem('auth.provider');
            localStorage.removeItem('auth.token');
            ProfileStatus.setComplete(false);
            $rootScope.status.loggedIn = false;
        },
        appendTokenToUrl: function (url) {
            var provider = localStorage.getItem('auth.provider');
            var token = localStorage.getItem('auth.token');
            var oauthParams = 'oauth_provider=' + provider + '&oauth_token=' + token;

            if (!token) {
                return url;
            }

            $rootScope.status.loggedIn = true;

            if (url.indexOf('?') !== -1) {
                return url + '&' + oauthParams;
            }
            else {
                return url + '?' + oauthParams;
            }
        }
    };
});

app.factory('AuthenticationInterceptor', function ($q, $location, $window, atlasHost, $log, $timeout, $rootScope) {
    return function (promise) {
        return promise.then(
            function (response) {
                 // Set up auto logout after 20 mins. Cancel any existing instance.
                 if ($rootScope.autologout) {
                     $timeout.cancel($rootScope.autologout);
                 }
                 $rootScope.autologout = $timeout(function () {
                     $location.path('/logout');
                 }, 20 * 60 * 1000);
                 return response;
            },
            function (response) {
                // if no auth token then need to make an access request to atlas
                if (response.config.url.indexOf(atlasHost) !== -1 && response.status === 400) {
                    $log.info('Not logged in');
                    $location.path('/login');
                }
                if (response.config.url.indexOf(atlasHost) !== -1 && response.status === 403) {
                    $window.location.href = '#/error?type=forbidden';
                }
                return $q.reject(response);
            }
        )
    }
})

// Make sure profile is completed before allowing use of app
app.factory('ProfileCompleteInterceptor', function (ProfileStatus, $location, $q, $rootScope) {
    return function (promise) {
        return promise.then(
            function (response) {
                var url = response.config.url;

                if (url.indexOf('partials/error') !== -1) {
                    return response;
                }

                if (ProfileStatus.isProfileComplete() ||
                    response.status === 400 ||
                    response.config.url.indexOf('/auth/') !== -1) {
                    return response;
                }

                if (url.indexOf('partials/request') !== -1 ||
                    url.indexOf('partials/source') !== -1 ||
                    url.indexOf('partials/application') !== -1) {

                    if (!ProfileStatus.isProfileComplete()) {
                        $location.path('/terms');
                        return $q.reject(response);
                    }
                }

                return response;
            },
            function (response) {
                return response;
            }
        );
    };
});


'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.atlas', []);

app.factory('Atlas', function ($http, atlasHost, atlasVersion, Authentication, $log) {
    return {
        getRequest: function(url) {
            return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion +  url));
        },
        postRequest: function(url, data) {
            return $http.post(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url), data, {withCredentials: false});
        },
        deleteRequest: function(url) {
            return $http.delete(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url));
        },
        getAuthProviders: function() {
            return $http.get(atlasHost + "/" + atlasVersion + "/auth/providers.json").then(function(results){
                var authProviders = [];
                return results.data.auth_providers;
            }, function(error) {
                $log.error(error);
            });
        },
        startOauthAuthentication: function(provider, callbackUrl, targetUri) {
            var url = atlasHost + provider.authRequestUrl + ".json?callbackUrl=" + callbackUrl;
            Authentication.setProvider(provider.namespace);
            return $http.get(url).then(function(result) {
                return result.data.oauth_request.login_url;
            }, function(error) {
                console.error(error);
                return error;
            });
        },
        getAccessToken: function(oauth_token, oauth_verifier, code) {
            var url = "/auth/" + Authentication.getProvider() + "/token.json?oauthToken=" + oauth_token
                    + "&oauthVerifier=" + oauth_verifier + "&code=" + code;
           return $http.get(atlasHost + "/" + atlasVersion +  url);
        },
        startLogout: function() {
           return $http.get(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + "/auth/logout.json"));
        }
    };
});
'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.users', []);

app.factory('Users', ['$http', 'Atlas', '$rootScope', 'Authentication', 'ProfileStatus', '$log', 'atlasApiHost', '$q',
    function($http, Atlas, $rootScope, Authentication, ProfileStatus, $log, atlasApiHost, $q) {
    return {
        currentUser: function() {
            return Atlas.getRequest('/auth/user.json').then(function(result) {
                if (result.data.user) {
                    if (result.data.user.license_accepted) {
                        ProfileStatus.setComplete(result.data.user.profile_complete);
                    }
                    return result.data.user;
                }
                $log.error("No user");
                return null;
            });
        },
        update: function(user, callback) {
            ProfileStatus.setComplete(true);
            return Atlas.postRequest("/users/" + user.id + ".json", user);
        },
        get: function(uid) {
            return Atlas.getRequest('/users/' + uid + '.json').then(function(result) {
                return result.data.user;
            });
        },
        all: function() {
            return Atlas.getRequest('/users.json').then(function(result) {
                return result.data.users;
            });
        },
        getTermsAndConditions: function() {
            return Atlas.getRequest('/eula.json').then(function(result) {
                if (result.status > 399) {
                    throw 'NOT_AVAILABLE/'+result.status;
                }
                return result.data.license.license;
            });
        },
        acceptTermsAndConditions: function(uid) {
            return Atlas.postRequest('/users/' + uid + '/eula/accept.json', {}).then(
                function(success) {
                    return success;
                },
                function(error) {
                    $log.error(error);
                }
            );
        },
        groups: function() {
            var defer = $q.defer();
            $http({
                method: 'get',
                url: Authentication.appendTokenToUrl(atlasApiHost+'/groups')
            })
            .success(defer.resolve)
            .error(defer.reject);
            return defer.promise;
        }
    };
}]);
app.factory('ProfileStatus', function() {
    return {
        setComplete: function(status) {
            localStorage.setItem("profile.complete", status ? "true" : "false");
        },
        isProfileComplete: function() {
            return localStorage.getItem("profile.complete") == "true";
        }
    };
});
'use strict';

/* Services */
var app = angular.module('atlasAdmin.services.applications', []);

app.factory('Applications', function (Atlas) {
    return {
        all: function () {
            return Atlas.getRequest('/applications.json').then(function (results) {
                return results.data.applications;
            });
        },
        get: function(applicationId) {
            return Atlas.getRequest('/applications/' + applicationId + '.json').then(function (results) {
                return results.data.application;
            });
        },
        create: function(title, description, url) {
            var data = {
                'title': title,
                'description': description,
                //'url': url,
                'publisher': {
                    'key': 'metabroadcast.com',
                    'name': 'MetaBroadcast',
                    'country': 'ALL'
                }
            }
            return Atlas.postRequest('/applications.json', data);
        },
        update: function(data, callback) {
            return Atlas.postRequest('/applications.json', data);
        },
        setPrecedence: function(applicationId, sourceIdOrder) {
            var url = '/applications/' + applicationId + '/precedence';
            var data = { 'ordering': sourceIdOrder };
            return Atlas.postRequest(url, data);
        },
        deletePrecedence:  function(applicationId) {
            var url = '/applications/' + applicationId + '/precedence';
            return Atlas.deleteRequest(url);
        },
        revokeApplication: function(data) {
            data.revoked = true;
            return Atlas.postRequest('/applications.json', data).then(function (results) {
                return results.data.data;
            });
        },
        unRevokeApplication: function(application) {
            application.revoked = false;
            return Atlas.postRequest('applications.json', application).then(function (results) {
                return results.data.application;
            });
        }
    };
 });
'use strict';

var app = angular.module('atlasAdmin.services.sources', []);
app.factory('Sources', function (Atlas, Applications, $log) {
    return {
        all: function () {
             return Atlas.getRequest('/sources.json').then(function(result) {return result.data.sources;});
        },
        get: function (sourceId) {
             return Atlas.getRequest('/sources/' + sourceId + '.json').then(function(result) {return result.data.source;});
        },
        changeAppState: function(sourceId, appId, state, callback) {
            var data = {};
            var url = "/sources/" + sourceId + "/applications/readers/" + appId + "/state?state="+ state;
            Atlas.postRequest(url, data, {withCredentials: false}).success(callback).error(function(error) {$log.error(error)});
        },
        addWriter: function(sourceId, appId, callback) {
            var url = "/sources/" + sourceId + "/applications?id=" + appId + "&permission=write";
            Atlas.postRequest(url, {}, {withCredentials: false}).success(callback);
        }
    }
 });
var app = angular.module('atlasAdmin.services.sourceRequests', []);

app.factory('sourceRequests', function (Atlas, Users) {
    return {
        all: function() {
            return Atlas.getRequest('/requests.json').then(function (results) {
                return results.data.source_requests});
        },
        send: function(sourceId, applicationId, applicationUrl, reason, usageType, licenseAccepted) {
            var url = "/sources/" + sourceId + "/requests?" 
                 + "appId=" + applicationId
                 + "&appUrl=" + encodeURIComponent(applicationUrl)
                 + "&reason=" + encodeURIComponent(reason)
                 + "&usageType=" + usageType 
                 + "&licenseAccepted=" + licenseAccepted;
            return Atlas.postRequest(url, {});
        },
        approve: function(requestId) {
            var url = '/requests/' + requestId + '/approve';
            return Atlas.postRequest(url, {});
        }
    }
});
'use strict'
var app = angular.module('atlasAdmin.services.sourceRequests');

app.factory('factorySourceRequests', ['$http', 'Authentication', 'atlasApiHost', '$q', 
    function($http, Authentication, atlasApiHost, $q) {

    var endpoint = atlasApiHost + '/requests';

    // use POST to send source request data to the server
    //
    // @returns thenable promise {number} status code from server (eg. 200 is ok)
    var postRequest = function(data) {
        var defer = $q.defer();
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint),
            data: data
        })
        .success(function(data, status) {
            defer.resolve(status);
        })
        return defer.promise;
    }

    // use GET to ask the server for all unapproved source requests
    //
    // @returns thenable promise {object} 
    var getUnapprovedRequests = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data) {
            defer.resolve(data)
        })
        return defer.promise;
    }

    // use PUT to update a source request
    //
    // @returns thenable promise {object}
    var putChangeRequest = function(data) {
        var defer = $q.defer();
        $http({
            method: 'put',
            url: Authentication.appendTokenToUrl(endpoint),
            data: data
        })
        .success(function(status) {
            defer.resolve(status);
        });
        return defer.promise;
    }
    
    // expose REST interface
    return {
        postRequest: postRequest,
        getUnapprovedRequests: getUnapprovedRequests,
        putChangeRequest: putChangeRequest
    };
}]);

var app = angular.module('atlasAdmin.services.sourceRequests');

app.factory('factorySourcePayments', function() {
    var plans = function() {
        return [{
            users: '1 to 10',
            price: 'Free'
        },
        {
            users: '11 to 1000',
            price: 95
        },
        {
            users: '1,001 to 10,000',
            price: 245
        },
        {
            users: '10,001 to 50,000',
            price: 995
        }];
    }

    return plans;
});
var app = angular.module('atlasAdmin.services.sourceLicenses', []);
app.factory('SourceLicenses', function (Atlas, Users) {
    return {
        get: function(sourceId) {
            return Atlas.getRequest('/source_licenses/' + sourceId + '.json').then(function (results) {
                return results.data.source_license});
        }
    }
});
var app = angular.module('atlasAdmin.services.uservideosources', []);
app.factory('UserVideoSources', function (Atlas, atlasVersion, Applications) {
    return {
        allProviders: function() {
            return Atlas.getRequest('/videosource/providers.json').then(function (results) {
                return results.data.link_providers});
        },
        getOAuthLogin: function(authUrl, callbackUrl) {
            var url = authUrl.replace("/" + atlasVersion, "") + ".json?redirectUri=" + encodeURIComponent(callbackUrl);
            return Atlas.getRequest(url).then(function (results) {
                return results.data.oauth_request});
        },
        getAllWritableSources: function() {
             return Applications.all().then(function(applications) {
                 // Extract writable sources from apps that give user write permission
                 var writable = {};
                 for (var i in applications) {
                     for (var j in applications[i].sources.writes) {
                         var source = applications[i].sources.writes[j];
                         writable[source.id] = source;
                     }
                 }
                 return writable;
             });
        },
    }
});
var app = angular.module('atlasAdmin.services.uservideosources.youtube', []);

app.factory('UserVideoSourcesYouTube', function (Atlas) {
    return {
        getChannels: function() {
            return Atlas.getRequest('/videosource/youtube/channels.json').then(function (results) {
                return results.data.user});
        },
        addPublisher: function(youTubeId, sourceId) {
            var url = '/videosource/youtube/' + youTubeId + '/source/add/' + sourceId + '.json';
            return Atlas.postRequest(url, {});
        },
        addChannel: function(youTubeId, channelId) {
            var url = '/videosource/youtube/' + youTubeId + '/channels/add/' + channelId + '.json';
            return Atlas.postRequest(url, {});
        }
    }
});
'use strict';

var app = angular.module('atlasAdmin.services.propositions', []);

app.factory('factoryPropositions', ['$http', 'Authentication', 'atlasApiHost', '$q', 
    function($http, Authentication, atlasApiHost, $q) {
    var endpoint = atlasApiHost + '/propositions';

    //  Get all propositions
    // 
    //  @returns promise
    var all = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        });
        return defer.promise;
    }

    //  Create a new proposition on the server
    //
    //  @param data {object}
    //  @returns promise
    var createProposition = function(data) {
        var defer = $q.defer();
        if ('object' !== typeof data) {
            defer.reject('First argument should be data object');
            return;
        }
        var payload = data;
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint),
            data: payload
        })
        .success(function(data, status) {
            defer.resolve(data, status)
        })
        .error(function(data, status) { defer.reject('There was an error with the request. [status: '+status+']'); });
        return defer.promise;
    }

    //  Delete a proposition on the server
    //
    //  @param data {object}
    //  @returns promise
    var removeProposition = function(itemId) {
        var defer = $q.defer();
        if ('object' !== typeof itemId) {
            defer.reject('First argument should be ID string');
            return;
        }
        $http({
            method: 'delete',
            url: Authentication.appendTokenToUrl(endpoint+'/'+itemId)
        })
        .success(function(data, status) {
            defer.resolve(data, status)
        })
        .error(function(data, status) { defer.reject('There was an error with the request. [status: '+status+']'); });
        return defer.promise;
    }

    //  Update a proposition on the server
    //
    //  @param data {object}
    //  @returns promise
    var updatePropositionStatus = function(itemId, status) {
        var defer = $q.defer();
        if ('string' !== typeof itemId || 'string' !== typeof status) {
            defer.reject('First argument should be ID string, the second should be status string')
            return;
        }
        var payload = { 'status': status }
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint+'/'+itemId+'/status'),
            data: payload
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) { defer.reject('There was an error with the request. [status: '+status+']'); })
        return defer.promise;
    }

    // expose the REST interface
    return {
        all: all,
        create: createProposition,
        remove: removeProposition,
        updateStatus: updatePropositionStatus
    }
}])
'use strict';
var app = angular.module('atlasAdmin.services.usage', []);

app.factory('APIUsage', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {
    var _endpoint = atlasApiHost + '/usage';

    function urlJoin() {
        var args_length = arguments.length;
        if (args_length > 0) {
            var parts = Array.prototype.slice.call(arguments, 0);
            return parts.join('/');
        }else{
            return null;
        }
    }

    function key_use_hour(apiKey) {
        var defer = $q.defer();
        var endpoint = urlJoin(_endpoint, apiKey, 'hour');
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) { 
            if (status === 200) {
                defer.resolve(data);
            }else{
                defer.reject(status);
            }
        })
        .error(function(data, status) {
            defer.reject(status);
        });
        return defer.promise;
    }

    function key_use_day(apiKey) {
        var defer = $q.defer();
        var endpoint = urlJoin(_endpoint, apiKey, 'day');
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) { 
            if (status === 200) {
                defer.resolve(data);
            }else{
                defer.reject(status);
            }
        })
        .error(function(data, status) {
            defer.reject(status);
        });
        return defer.promise;
    }

    function key_use_week(apiKey) {
        var defer = $q.defer();
        var endpoint = urlJoin(_endpoint, apiKey, 'week');
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) { 
            if (status === 200) {
                defer.resolve(data);
            }else{
                defer.reject(status);
            }
        })
        .error(function(data, status) {
            defer.reject(status);
        });
        return defer.promise;
    }

    function key_use_month(apiKey) {
        var defer = $q.defer();
        var endpoint = urlJoin(_endpoint, apiKey, 'month');
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) { 
            if (status === 200) {
                defer.resolve(data);
            }else{
                defer.reject(status);
            }
        })
        .error(function(data, status) {
            defer.reject(status);
        });
        return defer.promise;
    }

    return {
        hour: key_use_hour,
        day: key_use_day,
        week: key_use_week,
        month: key_use_month
    }
}]);
'use strict';

var app = angular.module('atlasAdmin.services.propositions');

app.factory('factoryWishes', ['$http', 'Authentication', 'atlasApiHost', '$q', 
    function($http, Authentication, atlasApiHost, $q) {

    var endpoint = atlasApiHost + '/wishes';


    //  Get wishes for current user
    var getUserWishes = function(userId) {
        var defer = $q.defer();
        var userId = userId || 'current';
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint+'/user/'+userId)
        })
        .success(function(data, status) {
            defer.resolve(data)
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        });
        return defer.promise;
    }


    //  Create a new wish
    //
    //  @param wishdata {object} the wish data to be sent to the server
    var createWish = function(wishdata) {
        var defer = $q.defer();

        if ('object' !== typeof wishdata) {
            defer.reject('First argument should be object containing wish data');
            return;
        }
        $http({
            method: 'post',
            url: Authentication.appendTokenToUrl(endpoint),
            data: wishdata
        })
        .success(function(data, status) {
            defer.resolve(data, status);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        })
        return defer.promise;
    }


    //  Get all wishes from the server
    //
    //  user must be admin to make this request
    var getAllWishes = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(endpoint)
        })
        .success(function(data, status) {
            defer.resolve(data);
        })
        .error(function(data, status) {
            defer.reject('There was an error with the request. [status: '+status+']');
        })
        return defer.promise;
    }

    // expose the REST interface
    return {
        all: getAllWishes,
        create: createWish,
        user: getUserWishes
    }
}])
'use strict';
var app = angular.module('atlasAdmin.services.feeds', []);

app.factory('FeedsService', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {

    //  Used for getting an array of available feeds for this user
    //
    //  @returns promise
    //
    var getFeeds = function() {
        var defer = $q.defer();
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(atlasApiHost+'/feeds')
        })
        .success(function(data, status) {
            if (status === 200) {
                defer.resolve(data)
            }else{
                defer.reject(err);
            }
        })
        .error(function(data, status) {
            defer.reject(status);
        });
        return defer.promise;
    }

    //  Used for making a request
    //
    //  @param feed_uri {string}
    //  @returns promise
    //
    var request = function(feed_uri) {
        var defer = $q.defer();
        if (!_.isString(feed_uri)) {
            defer.reject('Feed uri must be included as first argument')
            return defer.promise;
        }
        $http({
            method: 'get',
            url: Authentication.appendTokenToUrl(atlasApiHost+'/feeds/'+feed_uri)
        })
        .success(function(data, status) {
            defer.resolve(data);
        });
        return defer.promise;
    }
    

    return {
        get: getFeeds,
        request: request
    }
}]);
'use strict';

/* Filters */

angular.module('atlasAdmin.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
.filter('title', function() {
    return function(text) {
      return String(text).substring(0,1).toUpperCase() + String(text).substring(1);
    }
})
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if (input) {
            return input.slice(start);
        }
    }
})
.filter('sourceState', function() {
    return function(input, states) {
        var search = states.split("|");
        var output = [];
        for (var i in input) {
            if (search.indexOf(input[i].state) != -1) {
                output.push(input[i]);
            }
        }
        return output;
    }
})
.filter('sourceEnabled', function() {
    return function(input, isEnabled) {
        var output = [];
        for (var i in input) {
            if (input[i].enabled == isEnabled) {
                output.push(input[i]);
            }
        }
        return output;
    }
});

'use strict';

/* Directives */

var app = angular.module('atlasAdmin.directives.orderable', []);

app.directive('orderable', function () {
    return {
        link: function (scope, element) {
            // this gives us the native JS object
            var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    this.setAttribute('data-y', e.pageY);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function (e) {
                    this.classList.remove('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragenter',
                function (e) {
                    e.preventDefault();
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragover',
                function (e) {
                    e.preventDefault();
                    return false;
                },
                false
            );

             // removed dragover
            el.addEventListener(
                'dragleave',
                function (e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    this.classList.remove('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'drop',
                function (e) {
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    var isDown = item.getAttribute('data-y') < e.pageY;
                    var movedSourceId = item.id.replace('source-','');
                    var movedSource;
                    var reads = [];

                    if (e.preventDefault) { e.preventDefault(); }
                    // Stops some browsers from redirecting.
                    if (e.preventDefault) { e.preventDefault(); } // Stops FF from redirecting
                    if (e.stopPropagation) { e.stopPropagation(); }

                    item.removeAttribute('data-y');

                    if (isDown) {
                        // insert after
                        this.parentNode.insertBefore(item, this.nextSibling);
                    }
                    else {
                        // insert before
                        this.parentNode.insertBefore(item, this.nextSibling.previousSibling);
                    }

                    for (var i in scope.app.application.sources.reads) {
                        if (scope.app.application.sources.reads[i].id === movedSourceId) {
                            movedSource = scope.app.application.sources.reads[i];
                        }
                    }

                    for (var j in scope.app.application.sources.reads) {
                        var source = scope.app.application.sources.reads[j];

                        if (source.id === scope.source.id) {
                            if (isDown) {
                                reads.push(source, movedSource);
                            }
                            else {
                                reads.push(movedSource, source);
                            }
                        }
                        else if (source.id !== movedSourceId) {
                            reads.push(source);
                        }
                    }

                    scope.app.application.sources.reads = reads;

                    // we've updated the precedence order, so tell
                    // the controller about that
                    scope.$emit('precedenceOrder');

                    return false;
                },
                false
            );
        }
    };
});

'use strict';

/* Focus on an element. Use "focus-me" as an attribute. */

var app = angular.module('atlasAdmin.directives.focus', []);

app.directive('focusMe', function ($timeout) {    
    return {    
        link: function (scope, element, attrs, model) {  
            scope.$watch('trigger', function(value) {
                  $timeout(function () {
                  element[0].focus();
                });
            });           
        }
    };
});
'use strict';

/* Highlight current menu element */
/* Thanks to http://stackoverflow.com/questions/12592472/how-to-highlight-a-current-menu-item-in-angularjs */
var app = angular.module('atlasAdmin.directives.activePath', []);

app.directive('activePath', ['$location', 'ProfileStatus', function(location, ProfileStatus) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        var activeClass = attrs.activePath;
        var path = attrs.ngHref;
        if (path.substring(0,1) == "#") {
           path = path.substring(1);   
        }
        scope.location = location;
        scope.$watch('location.path()', function(currentPath) {
            // hide menu if profile not complete
            if (ProfileStatus.isProfileComplete()) {
                element.removeClass('hide');
            } else {
                element.addClass('hide');
            }
            
            // highlight active item
            if (path == currentPath.substring(0, path.length)) {
                element.addClass(activeClass);
            } else {
                element.removeClass(activeClass);
            }
        });
      }
    };
}]);
'use strict';

var app = angular.module('atlasAdmin.directives.validUsage', []);

app.directive('validUsage', function () { 
    return {
      require: 'ngModel',
      link: function(scope, ele, attrs, c) {
          scope.$watch(attrs.ngModel, function() {
              c.$setValidity('validUsage', ele[0].value != "0");
          });
      }
    }
});
var app = angular.module('atlasAdmin.directives.inputmorph', []);

app.directive('inputMorph', ['$document', function($document) {
    return function(scope, $el, attr) {
        var title = attr.title;
        var id = attr.inputMorph;

        // template
        $el.html( '<span class="button-state button medium stroke">I want this</span>'+
                      '<div class="form-state">'+
                          '<input type="text" name="reason" class="flush-right" placeholder="Briefly, why do you want access to '+title+'?">'+
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
            if (reason.length > 1) {
                scope.$parent.make_wish(id, reason);
            }else{
                console.error('Reason not long enough')
            }
        })
    }
}]);
'use strict';
var app = angular.module('atlasAdmin.directives.loadContent', []);

app.directive('loadContent', ['$document', 'FeedsService', '$q',
    function($document, Feeds, $q) {
    var _loaded = false;
    var loadContent = function(content) {
        var defer = $q.defer();
        if (!_loaded) {
            Feeds.request('youview/bbc_nitro.xml?uri='+content).then(function(xmlData){
                defer.resolve(xmlData);
                _loaded = true;
            });
        }else{
            defer.reject(null);
        }
        return defer.promise;
    }

    var controller = function($scope, element, attr) {
        var _content = attr.content,
            $el = $(element);

        $scope.showData = false;

        $('.loadData', $el).on('click', function() {
            var _this = $(this);
            _this.text('Loading data...');
            loadContent(_content).then(function(xml) {
                $scope.xml = xml;
                $scope.showData = true;
                _this.remove();
            });
        })
    }

    return {
        template: '<header>{{content}}<span class="button small loadData">Show data</span></header><div ng-show="showData" class="xml-data"><code>{{xml}}</code></div>',
        link: controller
    } 
}]);
'use strict';
var app = angular.module('atlasAdmin.controllers.errors', []);
app.controller('ErrorController', function($scope, $rootScope, $routeParams) {
    $rootScope.title = "Sorry, there was a problem....";
    $scope.alerts = [];
    if ($routeParams.type == "forbidden") {
        $scope.alerts.push({type:"danger", msg: "You do not have access to this resource"});        
    } else if ($routeParams.type == "not_available") {
        $scope.alerts.push({type:"info", msg: "This service is not currently available. Please try again later."});        
    } 
});
'use strict';
var app = angular.module('atlasAdmin.controllers.auth', []);

app.controller('CtrlLogin', function($scope, $rootScope, $rootElement, $routeParams, Atlas, atlasVersion, $location, Authentication, $log) {
    // add 'align-mid' class to the title element
    var h2_el = angular.element($rootElement).find('h2');
    var app_title = _.find(h2_el, function(el) {
        return angular.element(el).hasClass('app-title');
    });
    angular.element(app_title).addClass('align-mid')
    $rootScope.title = "Hi there, please sign in to continue";

    // Ask atlas for access here 
    Authentication.reset();
    Atlas.getAuthProviders().then(function(results) {
        var providers = [];
        for (var i=0; i<results.length; i++) {
            var provider = results[i];
            provider.icon = (provider.namespace === 'google')? 'google-plus' : provider.namespace;
            providers.push(provider);
        }
        $scope.providers = providers;
        if ($routeParams.providerNamespace) {
            $rootScope.startAuth($scope.providers.filter(function (provider) {
                return provider.namespace === $routeParams.providerNamespace;
            })[0]);
        }
    });
    
    $rootScope.startAuth = function(provider) {
        var uri,
            target;
        if ($location.absUrl().indexOf('/login/' + provider.namespace) !== -1) {
            uri = $location.absUrl().replace("/login/" + provider.namespace,"/oauth/" + provider.namespace);
            target = $location.absUrl().replace("/login/" + provider.namespace,"/");
        } else {
            uri = $location.absUrl().replace("/login", "/oauth/" + provider.namespace);
            target = $location.absUrl().replace("/login","/");
        }
        
        var callbackUrl = encodeURIComponent(uri);
        var targetUri = encodeURIComponent(target);
        
        Authentication.setProvider(provider.namespace);
        Atlas.startOauthAuthentication(provider, callbackUrl, targetUri).then(function(login_url) {
            window.location.href = login_url; 
        }, function(error) {
            $log.error("Error starting auth:");
            $log.error(error);   
        });
    };
});

app.controller('CtrlOAuth', function($scope, $rootScope, $routeParams, $location, Authentication, Atlas, $log, Users) {
    if (window.location.search.indexOf("code") == -1 &&  window.location.search.indexOf("oauth") == -1) {
        // search part will be empty if we have been here and cleared the oauth replies
        // In this case redirect.
        $location.path("/applications");
        return;
    }
    $rootScope.title = "Authenticating.....";
    Authentication.setProvider($routeParams.providerNamespace);
    var oauth_token = "";
    var oauth_verifier = "";
    var code = "";
    var searchParts = window.location.search.replace("?","").split("&");
    for (var i in searchParts) {
        var parts = searchParts[i].split("=");
        if (parts[0] == "oauth_token") {
           oauth_token = parts[1];
        } else if (parts[0] == "oauth_verifier") {
           oauth_verifier = parts[1];
        } else if (parts[0] == "code") {
           code = parts[1];
        }
    }
    
    Atlas.getAccessToken(oauth_token, oauth_verifier, code).then(function(results) {
        if (!results.data.oauth_result) {
            return;
        }
        Authentication.setToken(results.data.oauth_result.access_token);
        var redirectToSources = function() {
            window.location.search = "";
        };
        Users.currentUser().then(redirectToSources, function(error) {
            $log.error("Error setting user.");
            $log.error(error);
        });
    },
    function(error) {
        $log.error("Error getting access token.");
        $log.error(error);
        $location.hash("/login");
    });
});


app.controller('CtrlLogout', function($scope, $rootScope, $routeParams, $location, Authentication) {
    // Ask atlas for access here 
    $rootScope.title = "Logging out";
    Authentication.reset();
    $location.path("/login");
});
'use strict';
var app = angular.module('atlasAdmin.controllers.sources', []);
app.controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
    $rootScope.view_title = "Manage sources";
    $scope.app = {};
    Sources.all().then(function(sources) {
        $scope.app.sources = sources;
        $scope.app.predicate='name'; 
        $scope.app.reverse=false;
        $scope.app.pageSize=10;
        $scope.app.currentPage = 1;
    });
});
app.controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
    $scope.app = {};
    Sources.get($routeParams.sourceId).then(function(source) {
        $rootScope.title = source.name; 
        $scope.app.source = source;
    });

    Applications.all().then(function(applications) {
        var sourceSpecificApplications = [];
        for (var i in applications) {
            var sourceSpecificApplication = {
                "id": applications[i].id,
                "title": applications[i].title,
                "created": applications[i].created
            };
// find source
for (var j in applications[i].sources.reads) {
    if (applications[i].sources.reads[j].id == $routeParams.sourceId) {
        sourceSpecificApplication.sourceId = $routeParams.sourceId;
        sourceSpecificApplication.state = applications[i].sources.reads[j].state;
        sourceSpecificApplication.enabled = applications[i].sources.reads[j].enabled;
    }
}
sourceSpecificApplications.push(sourceSpecificApplication);
}     
$scope.app.applications = sourceSpecificApplications; 
$scope.app.predicate = "title";
$scope.app.reverse=false;
$scope.app.pageSize=10;
$scope.app.currentPage = 1;
});
    $scope.approveClicked = function (application) {
        Sources.changeAppState(application.sourceId, application.id, "available", function() {
            application.state = "available";
        });
    }

});
app.controller('CtrlSourceWriters', function($scope, $rootScope, $routeParams, Sources, Applications, $modal) {
    $scope.app = {};
    Sources.get($routeParams.sourceId).then(function(source) {
        $rootScope.title = source.name; 
        $scope.app.source = source;
    });

    Applications.all().then(function(applications) {
        var sourceSpecificApplications = [];
        for (var i in applications) {
            var sourceSpecificApplication = {
                "id": applications[i].id,
                "title": applications[i].title,
                "created": applications[i].created
            };
// find source
for (var j in applications[i].sources.writes) {
    if (applications[i].sources.writes[j].id == $routeParams.sourceId) {
      sourceSpecificApplications.push(sourceSpecificApplication);
  }
}
}     
$scope.app.applications = sourceSpecificApplications; 
$scope.app.predicate = "title";
$scope.app.reverse=false;
$scope.app.pageSize=10;
$scope.app.currentPage = 1;
});
    $scope.approveClicked = function (application) {
        Sources.changeAppState(application.sourceId, application.id, "available", function() {
            application.state = "available";
        });
    }

});

var AddWriterCtrl = function ($scope, $modal, $log, Applications, Sources) {
    $scope.addWriterDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/addWriterModal.html',
            controller: AddWriterTypeaheadCtrl
        });

        modalInstance.result.then(function (selectedItem) {
            Sources.addWriter($scope.app.source.id, selectedItem.id, function() {
                $scope.app.applications.push(selectedItem);
                $scope.successMessage = selectedItem.title + " now has write access to this source.";
            });
        }, function () {
            $log.info('Add writer cancelled at: ' + new Date());
        });
    };
};

function AddWriterTypeaheadCtrl($scope, $modalInstance, Applications) {
    $scope.item = {};
    $scope.item.invalid = true;
    $scope.item.selected = undefined;
    $scope.app = {};
    $scope.app.wait = true;
    Applications.all().then(function(applications) {
        $scope.app.wait = false;
        $scope.applications = applications;
    });

    $scope.ok = function () {
        $scope.app.wait = true;
        $modalInstance.close($scope.item.selected);
    };

    $scope.cancel = function () {
        $scope.app.wait = true;
        $modalInstance.dismiss('cancel');
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.item.invalid = false;
    }

    $scope.selectionChanged = function() {
        $scope.item.invalid = true; 
    }
}

var app = angular.module('atlasAdmin.controllers.sourceRequests', []);
app.controller('CtrlRequests', function($scope, $rootScope, $routeParams, sourceRequests, Applications, $q) {
    $rootScope.title = 'Requests';
    $scope.app = {};
    $scope.app.predicate = 'approved';
    $scope.app.reverse = false;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;
    sourceRequests.all().then(function(requests) {
        var applications = {};
        var appRequests = [];
        var forbidden = [];

        for (var i in requests) {
            if (!applications[requests[i].application_id] && forbidden.indexOf(requests[i].application_id) === -1) {
                applications[requests[i].application_id] = {};
                appRequests.push(Applications.get(requests[i].application_id));
            }
        }
        // get the application details for each requests and merge data
        $q.all(appRequests).then(function(results) {
            for (var i in results) {
               applications[results[i].id] = results[i];
            }
            for (var j in requests) {
               requests[j].application = applications[requests[j].application_id];
            }
            $scope.app.requests = requests;
        });
    });

    $scope.approveRequest = function(request) {
        sourceRequests.approve(request.id)
        .then(function() {
                request.approved = true;
            },
            function() {
                $scope.errorMessage = 'Sorry the request could not be approved due to an error';
            }
        );
    };
});
'use strict'
var app = angular.module('atlasAdmin.controllers.requestSource', []);

app.controller('CtrlRequestSource', ['$scope', '$rootScope', '$sce', '$routeParams', 'Applications', 'Users', 'factorySourcePayments', 'factorySourceRequests', 'SourceLicenses', '$location', 
    function( $scope, $rootScope, $sce, $routeParams, Applications, Users, factorySourcePayments, factorySourceRequests, SourceLicenses, $location) {
        $scope.planData = factorySourcePayments();
        $scope.button_txt = 'Accept';
        $scope.app = {};
        $scope.plan = 0;
        $scope.source = {};
        $scope.user = {};

        $scope.isNumber = function (value) {
          return angular.isNumber(value);
        };

        // used for referencing url params
        var appId    = $routeParams.applicationId,
            sourceId = $routeParams.sourceId;

        var getTerms = function(sourceId, callback) {
            SourceLicenses.get(sourceId).then(function(data) {
                callback(data);
            }, function(err) { callback(null); })
        }

        // use provider to get source data, then pass result to $scope
        Applications.get(appId).then(function(app) {
            var sources = app.sources.reads;
            var source = _.find(sources, function(src) {
                return src.id === sourceId;
            });
            $scope.source = source;
            $scope.app = app;
            getTerms(source.id, function(terms) {
                $scope.source.terms = _.isObject(terms)? $sce.trustAsHtml(terms.license) : null;
            })
        })

        // use provider to get user data, then pass result to $scope
        Users.currentUser().then( function(user) {
            $scope.user = user;
        });

        // when user switches between payment methods, update the model
        $scope.changeOfPlan = function(index) {
            $scope.plan = index;
        }

        // construct post payload, then send to the provider
        $scope.send = function() {
            $scope.button_txt = 'Sending...';
            var payload = {
                user: $scope.user,
                app: $scope.app,
                plan: $scope.planData[$scope.plan],
                source: $scope.source,
                reason: $scope.reason,
                state: 'not approved'
            }
            factorySourceRequests.postRequest(payload).then(function(status) {
                if (status === 200)
                    $location.path('/applications/'+appId);
            });
        };

        // on cancel, change location to application screen
        $scope.cancel = function() {
            $location.path('/applications/'+appId);
        }
}]);
'use strict';

/* User Profile Controller */

var app = angular.module('atlasAdmin.controllers.user', []);
app.controller('UserProfileController', function($scope, $rootScope, $routeParams, Users, Applications, $location) {

    $scope.app = {};

    $scope.app.isAdmin = false;
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;

    var populateApplications = function(idList) {
        $scope.app.applications = [];
        for (var i = 0; i < idList.length; i++) {
            Applications.get(idList[i]).then(function(application) {
                $scope.app.applications.push(application);
            });
        }
    };

    if ($routeParams.uid) {
        Users.get($routeParams.uid).then(function(user) {
            $scope.app.user = user;
            var title = 'Profile for ';
            if (user.full_name) {
                title += user.full_name;
            } else {
                title += 'user id ' + user.id;
            }
            $rootScope.title = title;
            Users.currentUser().then(function(editingUser) {
                $scope.app.isAdmin = editingUser.role === 'admin';
                $scope.app.editingUser = editingUser.id;

                if ($scope.app.isAdmin) {
                    populateApplications($scope.app.user.applications);
                }
            });
        });
    } else {
        Users.currentUser().then(function(user) {
            $scope.app.user = user;
            $rootScope.title = 'Your profile';
        });
    }

    $scope.save = function() {
        if ($scope.userForm.$invalid) {
            return;
        }
        $scope.app.changed = false;
        $scope.app.newUser = $scope.app.user.profile_complete === false;
        $scope.app.user.profile_complete = true;
        Users.update($scope.app.user).then(function() {
            var successMessage = 'Changes saved';
            // redirect new users to apps screen otherwise show message
            if ($scope.app.newUser) {
               $location.path('/');
            } else {
               $scope.successMessage = 'Changes saved';
            }
        },
        function() {
            $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
        });
    };
});
app.controller('AllUsersController', function($scope, $rootScope, $routeParams, Users) {
    $rootScope.view_title = 'Manage users';
    $scope.app = {};
    Users.all().then(function(users) {
         $scope.app.users = users;
    });
    $scope.app.predicate = 'full_name';
    $scope.app.reverse = false;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;
});
app.controller('UserMenuController', ['$scope', 'Users', '$rootScope', 'Authentication', '$location', 'FeedsService',
    function($scope, Users, $rootScope, Authentication, $location, Feeds) {
    // only try to get user if logged in
    $scope.app = {};
    $scope.app.dropdown = false;

    $scope.app.toggleDropdown = function() {
        $scope.app.dropdown = !$scope.app.dropdown;
    }

    var buildMenu = function(user) {
        // if profile not complete the do not show menu
        var allMenu = [
            {path:'/applications', label:'Applications'},
            {path:'/wishlist', label:'Wishlist'},
            // admin only
            {path:'/manage/sources', label:'Sources', role:'admin'},
            {path:'/manage/requests', label:'Requests', role:'admin'},
            {path:'/manage/users', label:'Users', role:'admin'},
            {path:'/manage/usage', label:'API Usage', role:'admin'},
            {path:'/manage/wishlist', label:'Wishlist', role:'admin'}];

        // Add blackout widget page to navigation 
        if (user.id === "hk98" ||
            user.id === "hmbc" ||
            user.id === "hmjh" ||
            user.id === "hmjg" ||
            user.id === "hmjc" ||
            user.id === "hmcz" ||
            user.id === "hmbb" ||
            user.id === "hk7v") {
            allMenu.push({path: '/epg/bt-tv', label: 'EPG'});
        }

        var menu = [];
        var admin_menu = [];
        for (var i = 0; i < allMenu.length; i++) {
            var item = allMenu[i];
            if (!item.role || item.role !== 'admin') {
                menu.push(item);
            }else if (user.role === 'admin') {
                admin_menu.push(item);
            }
        }
        return {
            users: menu,
            admins: admin_menu
        }
    };

    if (Authentication.getToken()) {
        Users.currentUser().then(function(user) {
            $scope.app.user = user;
            $scope.app.menu = buildMenu($scope.app.user);
        });
    }
}]);

app.controller('UserLicenseController', function($scope, $rootScope, $routeParams, Users, $location, $window, $sce, $log) {
    // only try to get user if logged in
    $scope.app = {};
    Users.currentUser().then(function(user) {
        $scope.app.user = user;
        $rootScope.title = 'Atlas usage guidelines, terms and conditions';
    });

    var error = function(error) {
        $log.error(error);
        $window.location.href = '/#/error?type=not_available';
    };

    Users.getTermsAndConditions().then(function(license) {
        $scope.app.license = $sce.trustAsHtml(license);
    }, error);

    $scope.app.accept = function() {
       Users.acceptTermsAndConditions($scope.app.user.id).then(function(data) {
          $location.path('/profile');
       }, error);
    };

    $scope.app.reject = function() {
        $location.path('/logout');
    };
});

'use strict';
var app = angular.module('atlasAdmin.controllers.uservideosources', []);

app.controller('CtrlVideoSourceProviders', function($scope, $rootScope, $location, UserVideoSources) {
    $rootScope.title = "Select video source provider";
    $scope.app = {};
    $scope.app.providers = [];
    if (window.location.search != "") {
        window.location.search = "";
    }
    UserVideoSources.allProviders().then(function(providers) {
        $scope.app.providers = providers;
    });
    
    $scope.app.startAuth = function(provider) {
        var callbackUrl = $location.absUrl().replace("/providers","/config/" + provider.namespace);
        UserVideoSources.getOAuthLogin(provider.authRequestUrl, callbackUrl).then(function(data) {
            // Redirect to remote service login screen
            window.location.href = data.login_url;
        });
    };
});
'use strict';
var app = angular.module('atlasAdmin.controllers.uservideosources.youtube', []);

app.controller('CtrlVideoSourceYouTubeConfig', function($scope, $rootScope, UserVideoSources, UserVideoSourcesYouTube) {
    $rootScope.title = "Configure YouTube link";
    
    $scope.app = {};
    if (window.location.search != "" && window.location.search.indexOf("error=") != -1) {
        window.location.href="#/videosource/providers";
        return;
    };
    $scope.app.writableSources = [];
    // populate available publishers
    UserVideoSources.getAllWritableSources().then(function(writableSources) {
       $scope.app.writableSources = writableSources; 
    });
    
    UserVideoSourcesYouTube.getChannels().then(function(data) {
        $scope.app.channels = [];
        for (var i in data) {
            var youTubeId = data[i].id;
            for (var j in data[i].channels) {
                // remove channels without titles
                 if (data[i].channels[j].title != "") {
                     var channel = {
                         id: data[i].channels[j].id,
                         youTubeId: youTubeId,
                         title: data[i].channels[j].title,
                         image_url: data[i].channels[j].image_url
                     };
                     $scope.app.channels.push(channel);
                 }
            }
        }
    });
    
    $scope.app.addChannel = function(channelId, youTubeId, source) {
        $scope.app.errorMessage = "";
        $scope.app.successMessage = "";
        if (!source) {
            $scope.app.errorMessage = "Please specify a publisher for your YouTube channel";
            return;   
        }
        
        $scope.app.infoMessage = "Please wait...";
        UserVideoSourcesYouTube.addPublisher(youTubeId, source.id).then(function(results) {
            UserVideoSourcesYouTube.addChannel(youTubeId, channelId).then(function(results) {
                $scope.app.infoMessage = "";
                $scope.app.successMessage = "Success! Your YouTube channel has been added.";
            },
            function(error) {
                $scope.app.infoMessage = "";
                $scope.app.errorMessage = "Your channel could not be added because an error occured. Please try again later";
            }
           );
        },
        function(error) {
            $scope.app.infoMessage = "";
            $scope.app.errorMessage = "There was a problem adding yout publisher. Please try again later";
        });
    };
});
'use strict';
var app = angular.module('atlasAdmin.controllers.feeds', []);

app.controller('CtrlFeeds', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.view_title = 'Feeds'
    
    Feeds.get().then(function(data) {
        console.log(data);
        if (!_.isEmpty(data)) {
            $scope.feeds = data;
        }
    });
}])
'use strict';
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.error = {};
    $scope.error.show = false;
    $scope.view_title = 'Feeds Console';

    // set up ordering
    $scope.table = {};
    $scope.table.reverse = false;
    $scope.table.order = 'id';

    $scope.search = {};

    Feeds.request('youview/bbc_nitro/transactions.json')
    .then(function(data) {
        if (_.isObject(data.error)) {
            $scope.error.show = true;
            $scope.error.obj = data.error;
        }
        $scope.transactions = data.transactions;
    });


    //  Used for calculating uptime since last outage
    //
    //  @param last_outage {date}
    //
    var calculateUptime = function(last_outage) {
        var _now = new Date(),
            _then = last_outage,
            _delta = Math.round(Math.abs((_now.getTime() - _then.getTime()))/(24*60*60*1000));
        return _delta.toString();
    }

    Feeds.request('youview/bbc_nitro/statistics.json')
    .then(function(data) {
        $scope.statistics = data.feed_stats[0];
        $scope.statistics.uptime = calculateUptime( new Date(data.feed_stats[0].last_outage) );
    });
}])
var app = angular.module('atlasAdmin.controllers.feeds');

app.controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {

    $scope.transactionID = $routeParams.transactionId;

    Feeds.request('youview/bbc_nitro/transactions/'+$routeParams.transactionId+'.json?annotations=status_detail')
    .then(function(transaction) {
        var _transaction = transaction.transactions[0];
        $scope.transaction = _transaction;
        $scope.view_title = "Breakdown for "+_transaction.id;
    });

}])
'use strict';

// define 'applications' module to be used for application controllers
angular.module('atlasAdmin.controllers.applications', []);

angular.module('atlasAdmin.controllers.applications')
.controller('CtrlApplications', ['$scope', '$rootScope', '$routeParams', 'Applications', '$modal', '$location',
    function($scope, $rootScope, $routeParams, Applications, $modal, $location) {

    $scope.view_title = 'My Applications';
    $scope.app = {};
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;

    // retreive a list of all apps 
    Applications.all().then(function(applications) {
        $scope.app.applications = applications;
        $scope.state = (applications.length) ? 'table' : 'blank';
    });

    // instantiate a new modal window
    $scope.createApplication = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/newApplicationModal.html',
            controller: 'CreateApplicationFormModalCtrl',
            scope: $scope
        });
        modalInstance.result.then(function(application) {
            // if all sources are selected, go to edit page
            if ( 'all' === application.source ) { 
                $location.path('/applications/' + application.id);
            }else{
                $scope.app.applications.push(application)
            }
        });
    };

    $scope.appSearchFilter = function(application) {
        if (!$scope.query || $scope.query === '') {
            return true;
        }
        // Search on title match or if query is over 10 chars long the api key
        return application.title.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1
                || ($scope.query.length > 10 && application.credentials.apiKey.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1);
    };
}]);
'use strict';

angular.module('atlasAdmin.controllers.applications')
.controller('CtrlApplicationEdit', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', 'SourceLicenses', '$modal', '$sce', '$log', 
    function($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, $modal, $sce, $log) {

    $scope.app = {};
    $scope.app.edited = {};
    $scope.app.edited = {'meta':false,'precedenceState':false,'precedenceOrder':false};
    $scope.app.changed = false;
    var leavingPageText = 'You have unsaved changes!';
    $scope.view_title = 'Edit application';

    window.onbeforeunload = function() {
        if ($scope.app.changed) {
            return leavingPageText;
        }
    };

    $scope.$on('$locationChangeStart', function(event, next, current) {
        if ($scope.app.changed && !confirm(leavingPageText + '\n\nAre you sure you want to leave this page?')) {
            event.preventDefault();
        }
    });

    Applications.get($routeParams.applicationId).then(function(application) {
        $scope.app.application = application;
        $scope.app.writes = {};
        $scope.app.writes.predicate = 'name';
        $scope.app.writes.reverse = false;
        $scope.view_subtitle = application.title;
    });

    $scope.app.disableSource = function(source) {
        var reads = [];
        for (var i in $scope.app.application.sources.reads) {
            var readEntry = $scope.app.application.sources.reads[i];
            if (readEntry.id === source.id) {
                readEntry.enabled = false;
            }
            reads.push(readEntry);
        }
        $scope.app.application.sources.reads = reads;
        $scope.app.edited.meta = true;
    };

    $scope.app.enableSource = function(source) {
        var reads = [];
        for (var i in $scope.app.application.sources.reads) {
            var readEntry = $scope.app.application.sources.reads[i];
            if (readEntry.id == source.id) {
                readEntry.enabled = true;
            }
            reads.push(readEntry);
        }
        $scope.app.application.sources.reads = reads;
        $scope.app.edited.meta = true;
    }

    $scope.app.requestSource = function(source) {
        $scope.app.sourceRequest = {};
        $scope.app.license = null;
        SourceLicenses.get(source.id).then(
            function(data) {
                if (data && data.license) {
                    $scope.app.license = $sce.trustAsHtml(data.license);
                }
            },
            function(error) {
                $log.error(error);
            }
        );
        $scope.app.sourceRequest.source = source;
        $scope.app.sourceRequest.applicationId = $scope.app.application.id;
        var modalInstance = $modal.open({
            templateUrl: 'partials/sourceRequestModal.html',
            controller: 'SourceRequestFormModalCtrl',
            scope: $scope
        });
        modalInstance.result.then(function() {
            Applications.get($scope.app.application.id).then(function(application) {
                $scope.app.application = application;
            });
        });
    };

    $scope.enablePrecedence = function() {
        $scope.app.application.sources.precedence = true;
        $scope.app.edited.precedenceState = true;
    };

    $scope.disablePrecedence = function() {
        $scope.app.application.sources.precedence = false;
        $scope.app.edited.precedenceState = true;
        $scope.app.edited.precedenceOrder = false;
    };

    $scope.revokeApplication = function() {
        Applications.revokeApplication($scope.app.application).then(function(application) {
            $scope.app.application = application;
        });
    };

    $scope.unRevokeApplication = function() {
        Applications.unRevokeApplication($scope.app.application).then(function(application) {
            $scope.app.application = application;
        });
    };

    $scope.save = function() {
        // Decide how to perform the update based on what has changed
        if ($scope.app.edited.meta) {
            if (!$scope.detailsForm.appTitle.$valid) {
                $scope.app.errorMessage = 'Application title must be at least three characters long';
            } else {
                Applications.update($scope.app.application).then(function() {
                    $scope.successMessage = 'Changes saved';
                },
                function() {
                    $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
                });
            }
        } else if ($scope.app.edited.precedenceState && !$scope.app.application.sources.precedence) {
            // precedence has been disabled
            Applications.deletePrecedence($scope.app.application.id).then(function() {
                $scope.successMessage = 'Changes saved';
            },
            function() {
                $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
            });

        } else if ($scope.app.edited.precedenceState || $scope.app.edited.precedenceOrder) {
            var sourceIdOrder = [];
            for (var i in $scope.app.application.sources.reads) {
                sourceIdOrder.push($scope.app.application.sources.reads[i].id);
            }
            Applications.setPrecedence($scope.app.application.id, sourceIdOrder).then(function() {
                $scope.successMessage = 'Changes saved';
            },
            function() {
                $scope.errorMessage = 'Sorry, there was an error and your changes could not be saved';
            });
        }

        $scope.app.edited = {
            'meta': false,
            'precedenceState': false,
            'precedenceOrder': false
        };

        $scope.app.changed = false;
    };

    $scope.app.viewTerms = function(source) {
        // Source Licence is a API name and a T&Cs
        SourceLicenses.get(source.id).then(function(data) {
            // not all sources have licenses
            if (data && data.license) {
                // $scope.app.license should be templated
                $scope.app.license = $sce.trustAsHtml(data.license);
            }
            else {
                $scope.app.license = $sce.trustAsHtml('Please contact us for more details regarding access and pricing for this source.');
            }
        },
        function(error) {
            $log.error(error);
        });

        var modalInstance = $modal.open({
            templateUrl: 'partials/viewTermsModal.html',
            controller: 'ViewTermsCtrl',
            scope: $scope
        });
    };

    // listen for an event from the orderable list
    // to tell us when it has been updated, and then
    // run the digest
    $scope.$on('precedenceOrder', function() {
        $scope.app.edited.precedenceOrder = true;
        $scope.$digest();
    });

    // deep-watch `app.edited` for changes so that we can reveal
    // the save button when something has changed
    $scope.$watch('app.edited', function(newVal) {
        angular.forEach(newVal, function(val) {
            if (val) {
                $scope.app.changed = true;
            }
            return;
        });
    }, true);

    // @TODO: if the user changes the model back to the way how it was
    // before the UI was touched, `app.changed` should be `false`
}]);
'use strict';

angular.module('atlasAdmin.controllers.applications')
.controller('CreateApplicationFormModalCtrl', ['$scope', '$q', '$sce', '$modalInstance', 'Applications', 'sourceRequests', 'SourceLicenses', '$location', 
    function($scope, $q, $sce, $modalInstance, Applications, SourceRequests, SourceLicenses, $location) {
    $scope.app.showTerms = false;
    $scope.app.acceptTerms = false;
    $scope.app.title = '';
    $scope.app.url = '';
    $scope.app.description = '';
    $scope.app.preset = null;
    $scope.license = {};
    $scope.license.show = false;

    var getTerms = function(source) {
        var defer = $q.defer();
        var sourceId = null;
        if (source === 'PA') {
            sourceId = 'cpc';
        }else if (source === 'BBC') {
            sourceId = 'cpy';
        }
        SourceLicenses.get(sourceId).then(function(data) {
            if (!_.isObject(data)) {return false}
            var license = $sce.trustAsHtml(data.license);
            defer.resolve(license);
        })
        return defer.promise;
    }

    // decide whether terms should be shown for this source set
    $scope.termsToggle = function(preset) {
        $scope.app.showTerms = ($scope.app.preset == 'uk')
    }

    // used to show the user terms for source
    $scope.showTerms = function(source) {
        getTerms(source).then(function(license) {
            $scope.license.show = true;
            $scope.license.html = license;
        })
    }

    $scope.submit = function() {
        var app_title       = $scope.app.title,
            app_url         = $scope.app.url,
            app_description = $scope.app.description,
            app_preset      = $scope.app.preset,
            app_terms       = $scope.app.acceptTerms;

        // save the app data
        if (!_.isEmpty(app_title) && !_.isEmpty(app_url) && _.isString(app_preset)) {
            if (app_preset === 'uk' && !app_terms) return;
            Applications.create(app_title, app_description, app_url).then(function(result) {
                if (result.data.application.id) {
                    var appId = result.data.application.id;
                    // enable basic sources matching on simple account
                    if (app_preset === 'uk') {
                        var _item, sourceOrder = [], enableSources = [];
                        for (var source in result.data.application.sources.reads) {
                            _item = result.data.application.sources.reads[source];
                            if (_item.title === 'BBC' || _item.title === 'PA') {
                                enableSources.push(_item);
                            }
                            sourceOrder.push(_item.id);
                        }
                        // send source requests for default sources
                        _(enableSources).forEach(function(src) {
                            SourceRequests.send(src.id, appId, app_url, '', 'personal', true);
                        })
                        Applications.setPrecedence(appId, sourceOrder);
                    }else{
                        $location.path('/applications/'+appId);
                    }
                    // close modal and return data tot he $scope
                    result.data.application.source = $scope.app.sources;
                    $modalInstance.close(result.data.application);
                }
            });
        }
    };

    // cancel and close modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);
'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist', []);

app.controller('CtrlWishlist', ['$scope', '$rootScope', '$routeParams', 'factoryPropositions', 'factoryWishes', 'Users', '$q', 
    function ($scope, $rootScope, $routeParams, Propositions, Wishes, Users, $q) {

    // tab state (sources | features)
    $rootScope.currentTab = 'sources';

    // request wishes for current user and inject into rootScope
    Wishes.user().then(function(data) {
        $rootScope.wishes = data;
    })

    // request all wishlist data and inject into rootScope
    Propositions.all().then(function(data) {
        $rootScope.wishlist = data;
    }, 
    function(msg) { console.error(msg) });
}]);

'use strict';

var app = angular.module('atlasAdmin.controllers.wishlist');

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
'use strict';
var app = angular.module('atlasAdmin.controllers.wishlist');

app.controller('CtrlWishlistFeatures', ['$scope', '$rootScope', '$routeParams', 'factoryWishes', '$q', '$modal',
    function ($scope, $rootScope, $routeParams, Wishes, $q, $modal) {
    var root = $rootScope;
    $scope.features = {};
    $scope.asked = {};

    root.$watch('wishlist', function(new_val, old_val) {
        $scope.features = _.filter($rootScope.wishlist, function(n) {
            return n.type === 'feature';
        })
    });
    root.$watch('wishes', function(new_val, old_val) {
        $scope.asked = _.filter(root.wishes, function(n) {
            return n.wish.type === 'feature';
        })
    });

    $scope.user_has = function(item_id) {
        var t = _.filter($scope.asked, {wish: { _id: item_id }});
        return t.length > 0;
    }

    $scope.make_wish = function(featureId, reason) {
        var item = _.filter($scope.features, function(n) {
            return n._id === featureId;
        })[0];
        if ('object' !== typeof item) throw new TypeError(); 
        var postdata = {
            wish: item,
            reason: reason
        }
        Wishes.create(postdata).then(function(data) {
            $scope.asked.push(data);
        });
    }

    $scope.customFeatureWish = function() {
        $scope.modal = {
            title: 'Tell us about a feature'
        }
        var modalInstance = $modal.open({
            templateUrl: 'partials/wishlist/customFeatureRequestModal.html',
            controller: 'customFeatureRequestModal',
            scope: $scope
        });

    };
}]);

app.directive('featureRow', ['$document', function($document) {
    var template = 
            '<td class="feature-item">'+
                '<div class="feature-name panel-half"><h2>{{feature.title}}</h2></div>'+
                '<div class="feature-options panel-half">'+
                    '<span ng-if="!user_has(feature._id)" data-title="{{feature.title}}" input-morph="{{feature._id}}" class="button-to-input"></span>'+
                    '<span ng-if="user_has(feature._id)" class="button medium stroke disabled">Requested</span>'+
                '</div>'+
                '<div class="feature-detail panel-full">'+
                    '<div class="panel-half feature-description"><p>{{feature.feature.description}}</p></div>'+
                    '<div class="panel-half"></div>'+
                '</div>'+
            '</td>';

    return {
        scope: false,
        template: template
    }
}]);

app.controller('customFeatureRequestModal', ['$scope', '$rootScope', '$routeParams', '$q',
    function($scope, $rootScope, $routeParams, $q) {
        
}])
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
        templateUrl: '/partials/admins/wishlist/newItemModal.html',
        controller: 'CtrlNewWishlistItemModal',
        scope: $scope
    })
    .result.then(function(data) {
        $scope.sources.push(data);
    });
}


app.controller('CtrlManageWishlist', ['$scope', '$rootScope', 'factoryPropositions', 'factoryWishes',
    function($scope, $rootScope, Propositions, Wishes) {
    $scope.app = {};
    $rootScope.requestsToday = {};
    $rootScope.currentTab = 'source-requests'

    Wishes.all().then(function(data, status) {
        $rootScope.wishes = data;
    }, function(err) { console.error(err) });

    Propositions.all().then(function(data, status) {
        $rootScope.items = data;
    }, function(err) { console.error(err) });
}])


app.controller('CtrlManageWishlistSourceRequests', [ '$scope', '$rootScope',
    function($scope, $rootScope) {

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


app.controller('CtrlManageWishlistFeatureRequests', [ '$scope', '$rootScope',
    function($scope, $rootScope) {

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


app.controller('CtrlManageWishlistSources', ['$scope', '$rootScope', '$modal',
    function($scope, $rootScope, $modal) {

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


app.controller('CtrlManageWishlistFeatures', ['$scope', '$rootScope', '$modal',
    function($scope, $rootScope, $modal) {

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


app.controller('CtrlNewWishlistItemModal', ['$scope', '$rootScope', '$modalInstance', 'factoryPropositions',
    function($scope, $rootScope, $modalInstance, Propositions) {
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
        Propositions.create(data).then(function(data) {
            $modalInstance.close(data);
        });
    }
    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
}])


app.directive('deleteitem', ['$document', 'factoryPropositions', 
    function factory($document, Propositions) {
    var definitionObj = {
        link: function(scope, $el, attr) {
            $el.on('click', function() {
                var itemId = attr.id;
                if ('string' === typeof itemId) {
                    scope.$apply(function() {
                        _.remove(scope.$parent.sources, function(n) {
                            return n._id === itemId;
                        });
                    })
                    Propositions.remove(itemId);
                }
            })
        }
    }
    return definitionObj;
}])


app.directive('changestatus', ['$document', 'factoryPropositions', 
    function factory($document, Propositions) {
    var definitionObj = {
        link: function(scope, $el, attr) {
            $el.on('click', function() {
                var itemId = attr.id;
                var status = attr.changestatus;
                var parentClassRegex = new RegExp('\\b' + 'state-' + '.+?\\b', 'g'); 
                if ('string' === typeof itemId && 'string' === typeof status) {
                    $el.parent().children().removeClass('active');
                    $el.addClass('active');
                    Propositions.updateStatus(itemId, status);
                }
            })
        }
    }
    return definitionObj;
}])
'use strict'
var app = angular.module('atlasAdmin.controllers.admins.manageSourceRequests', []);

app.controller('CtrlManageSourceRequests', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'factorySourceRequests', '$location',
    function($scope, $rootScope, $routeParams, Applications, Users, factorySourceRequests, $location) {
    $scope.app = {};
    $scope.app.requests = {};

    // 'orderBy' helper for sorting requests by source name
    $scope.sortBySourceName = function(val) {
        return val.source.title;
    }

    // send request to approve source to the server, then remove the request
    // from the list
    // @param appId {string}  the `app.id` value from mongo
    // @param sourceId {string}  the `source.id` value from mongo
    // @param state {string}  new state of request (defaults to 'approved')
    var changeRequestState = function(appId, sourceId, state) {
        if (!_.isString(appId) && !_.isString(sourceId)) return false;        
        var payload = {
            appId: appId,
            sourceId: sourceId, 
            new_state: state || 'approved'
        }
        factorySourceRequests.putChangeRequest(payload).then(function(status) {
            if (status.ok && status.n === 1) {
                _.remove($scope.app.requests, function(n) {
                    return ((n.app.id === appId) && (n.source.id === sourceId));
                })
            }
        })
    }

    $scope.approveRequest = function(appId, sourceId, $event) {
        if (typeof $event !== 'undefined') $($event.currentTarget).addClass('xhr-progress');
        return changeRequestState(appId, sourceId, 'approved');
    }

    // pull request data from the api and push result into the $scope
    factorySourceRequests.getUnapprovedRequests().then(function(data) {
        $scope.app.requests = data;
    });
}])
'use strict';
var app = angular.module('atlasAdmin.controllers.admins.usage', []);

app.controller('CtrlUsage', ['$scope', '$rootScope', 'APIUsage', 
    function($scope, $rootScope, Usage) {
    $scope.apiKey = '';

    $scope.errorMessage = function(msg) {
        console.log(msg);
    }

    function Graph(data) {
        var histogram = data.facets[0].entries;
        var maxCount = _.max(histogram, function(n) {
            return n.count;
        });

        this.clear_graph();

        var margin = {top: 30, right: 30, bottom: 60, left: 60},
            width = 1000 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        this.startTime = null;
        this.endTime = null;

        this.create_axes = function() {
            var x = d3.time.scale().domain([this.startTime, this.endTime]).range([0, width]);
            var y = d3.scale.linear().domain([0, (maxCount.count + 100)]).range([height, 0]);
            var line = d3.svg.line()
                .x(function(d,i) { 
                    return x(d.time); 
                })
                .y(function(d) { 
                    return y(d.count); 
                })

            var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
            Graph.prototype.graph.append("svg:g")
                 .attr("class", "x axis")
                 .attr("transform", "translate(0,"+height+")")
                 .call(xAxis);

            var yAxis = d3.svg.axis().scale(y).ticks(4).orient("left");
            Graph.prototype.graph.append("svg:g")
                      .attr("class", "y axis")
                      .attr("transform", "translate(-25,0)")
                      .call(yAxis);
            Graph.prototype.graph.append('svg:path').attr('d', line(histogram));
        }

        this.draw = function() {
            Graph.prototype.graph = d3.select('.rpm-chart-container')
                           .append('svg:svg')
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append('svg:g')
                           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            this.create_axes();
        }
    }

    Graph.prototype.graph = null;
    Graph.prototype.clear_graph = function() {
        if (this.graph) {
            $('.rpm-chart-container svg').remove();
            this.graph = null;
        }
    }

    $scope.switchTime = function(timeRange) {
        switch(timeRange) {
            case 'hour':
                loadGraphHour();
                break;
            case 'day':
                loadGraphDay();
                break;
            case 'week':
                loadGraphWeek();
                break;
            case 'month':
                loadGraphMonth();
                break;
        }
    }

    var loadGraphHour = function() {
        var _key = $scope.apiKey || '';
        if (_key.length) {
            $scope.tabState = 'hour';
            Usage.hour(_key).then(function(data) {
                var endTime = new Date(),
                    startTime = new Date(new Date().setHours(endTime.getHours()-1));
                var graph = new Graph(data);
                graph.endTime = endTime;
                graph.startTime = startTime;
                graph.draw();
            }, function(err) {
                $scope.errorMessage('Can\'t load data for the api key')
            });
        }
    }

    var loadGraphDay = function() {
        var _key = $scope.apiKey || '';
        if (_key.length) {
            $scope.tabState = 'day';
            Usage.day(_key).then(function(data) {
                var endTime = new Date(),
                    startTime = new Date(new Date().setHours(endTime.getHours()-24));
                var graph = new Graph(data);
                graph.endTime = endTime;
                graph.startTime = startTime;
                graph.draw();
            }, function(err) {
                $scope.errorMessage('Can\'t load data for the api key')
            });
        }
    }

    var loadGraphWeek = function() {
        var _key = $scope.apiKey || '';
        if (_key.length) {
            $scope.tabState = 'week';
            Usage.week(_key).then(function(data) {
                var endTime = new Date(),
                    startTime = new Date(new Date().setDate(endTime.getDate()-7));
                var graph = new Graph(data);
                graph.endTime = endTime;
                graph.startTime = startTime;
                graph.draw();
            }, function(err) {
                $scope.errorMessage('Can\'t load data for the api key')
            });
        }
    }

    var loadGraphMonth = function() {
        var _key = $scope.apiKey || '';
        if (_key.length) {
            $scope.tabState = 'month';
            Usage.month(_key).then(function(data) {
                var endTime = new Date(),
                    startTime = new Date(new Date().setDate(endTime.getDate()-30));
                var graph = new Graph(data);
                graph.endTime = endTime;
                graph.startTime = startTime;
                graph.draw();
            }, function(err) {
                $scope.errorMessage('Can\'t load data for the api key')
            });
        }
    }

    loadGraphDay();
}]);
'use strict';
var app = angular.module('atlasAdmin.controllers.atlas', []);

function ViewTermsCtrl($scope, $modalInstance, Applications, sourceRequests, $log) {
    $scope.close = function() {
        $modalInstance.dismiss();
    };
}
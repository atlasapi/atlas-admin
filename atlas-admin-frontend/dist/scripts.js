'use strict';

// Declare app level module which depends on filters, and services
angular.module('atlasAdmin',
   [
    'ui.bootstrap',
    'atlasAdmin.filters',
    'atlasAdmin.login',
    'atlasAdmin.logout',
    'atlasAdmin.auth',
    'atlasAdmin.applications',
    'atlasAdmin.application',
    'atlasAdmin.requestSource',
    'atlasAdmin.wishlist',
    'atlasAdmin.epg',
    'atlasAdmin.scrubbables',
    'atlasAdmin.feeds',
    'atlasAdmin.feed',
    'atlasAdmin.feedBreakdown',
    'atlasAdmin.manageSources',
    'atlasAdmin.manageSourcesReaders',
    'atlasAdmin.manageSourcesWriters',
    'atlasAdmin.manageRequests',
    'atlasAdmin.manageUsers',
    'atlasAdmin.manageUser',
    'atlasAdmin.manageUsage',
    'atlasAdmin.manageWishlist',
    'atlasAdmin.terms',
    'atlasAdmin.profile',
    'atlasAdmin.contact',
    'atlasAdmin.videoSourceProviders',
    'atlasAdmin.videoSourceConfig',
    'atlasAdmin.error',
    'atlasAdmin.menu',

    'atlasAdmin.directives.preloader',
    'atlasAdmin.directives.activePath',

    'atlasAdmin.services.auth',

    'atlasAdmin.interceptors.auth',
    'atlasAdmin.interceptors.loading',
    'atlasAdmin.interceptors.profileComplete',

    'ngResource',
    'ngRoute',
    'atlasAdminConfig'
  ]);

'use strict';

angular.module('atlasAdmin.filters', []);

'use strict';

angular.module('atlasAdmin.application', [
    'ngRoute',
    'atlasAdmin.directives.orderable',
    'atlasAdmin.directives.focus',
    'atlasAdmin.directives.validUsage',
    'atlasAdmin.services.atlas',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sources',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.sourceLicenses',
    'atlasAdmin.services.apiUsage'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId', {
      templateUrl: 'app/presentation/application/application.tpl.html',
      controller: 'CtrlApplicationEdit',
      reloadOnSearch: false
    });
  }]);

'use strict';

angular.module('atlasAdmin.applications', [
    'ngRoute',
    'atlasAdmin.directives.focus',
    'atlasAdmin.services.atlas',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.sourceLicenses'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications', {
      templateUrl: 'app/presentation/applications/applications.tpl.html',
      controller: 'CtrlApplications'
    });
  }]);

'use strict';

angular.module('atlasAdmin.auth', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/oauth/:providerNamespace', {
      templateUrl: 'app/presentation/auth/auth.tpl.html',
      controller: 'CtrlOAuth',
      reloadOnSearch: false
    });
  }]);

'use strict';

angular.module('atlasAdmin.contact', [
    'ngRoute',
    'atlasAdmin.services.users',
    'atlasAdmin.services.groups'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contact', {
      templateUrl: 'app/presentation/contact/contact.tpl.html',
      controller: 'ContactController'
    });
  }]);

'use strict';

angular.module('atlasAdmin.epg', [
    'ngRoute',
    'atlasAdmin.services.users'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/epg/bt-tv', {
      templateUrl: 'app/presentation/epg/epg.tpl.html',
      controller: 'CtrlEPGWidget'
    });
  }]);

'use strict';

angular.module('atlasAdmin.error', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/error', {
      templateUrl: 'app/presentation/error/error.tpl.html',
      controller: 'ErrorController',
      reloadOnSearch: false
    });
  }]);

'use strict';

angular.module('atlasAdmin.feedBreakdown', [
    'ngRoute',
    'atlasAdmin.directives.loadContent',
    'atlasAdmin.directives.actionModal',
    'atlasAdmin.services.feeds'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds/:feedId/:taskId', {
      templateUrl: 'app/presentation/feedBreakdown/feedBreakdown.tpl.html',
      controller: 'CtrlFeedsBreakdown'
    });
  }]);

'use strict';

angular.module('atlasAdmin.feed', [
    'ngRoute',
    'atlasAdmin.directives.actionModal',
    'atlasAdmin.services.feeds'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds/:feedId', {
      templateUrl: 'app/presentation/feed/feed.tpl.html',
      controller: 'CtrlFeedsConsole'
    });
  }]);

'use strict';

angular.module('atlasAdmin.feeds', [
    'ngRoute',
    'atlasAdmin.services.feeds'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/feeds', {
      templateUrl: 'app/presentation/feeds/feeds.tpl.html',
      controller: 'CtrlFeeds'
    });
  }]);

'use strict';

angular.module('atlasAdmin.login', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'app/presentation/login/login.tpl.html',
      controller: 'CtrlLogin'
    });
    $routeProvider.when('/login/:providerNamespace', {
      templateUrl: 'app/presentation/login/login.tpl.html',
      controller: 'CtrlLogin'
    });
  }]);

'use strict';

angular.module('atlasAdmin.logout', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/logout', {
      templateUrl: 'app/presentation/logout/logout.tpl.html',
      controller: 'CtrlLogout'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageRequests', [
    'ngRoute',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.users'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/requests', {
      templateUrl: 'app/presentation/manageRequests/manageRequests.tpl.html',
      controller: 'CtrlManageSourceRequests'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageSources', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources', {
      templateUrl: 'app/presentation/manageSources/manageSources.tpl.html',
      controller: 'CtrlSources'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageSourcesReaders', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources/:sourceId/readers', {
      templateUrl: 'app/presentation/manageSourcesReaders/manageSourcesReaders.tpl.html',
      controller: 'CtrlSourceReaders'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageSourcesWriters', ['ngRoute', 'atlasAdmin.directives.focus'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/sources/:sourceId/writers', {
      templateUrl: 'app/presentation/manageSourcesWriters/manageSourcesWriters.tpl.html',
      controller: 'CtrlSourceWriters'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageUsage', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/usage', {
      templateUrl: 'app/presentation/manageUsage/manageUsage.tpl.html',
      controller: 'CtrlUsage'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageUser', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/users/:uid', {
      templateUrl: 'app/presentation/manageUser/manageUser.tpl.html',
      controller: 'UserProfileController'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageUsers', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/users', {
      templateUrl: 'app/presentation/manageUsers/manageUsers.tpl.html',
      controller: 'AllUsersController'
    });
  }]);

'use strict';

angular.module('atlasAdmin.manageWishlist', [
    'ngRoute',
    'atlasAdmin.directives.deleteItem',
    'atlasAdmin.directives.changeStatus',
    'atlasAdmin.services.propositions',
    'atlasAdmin.services.wishes'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/manage/wishlist', {
      templateUrl: 'app/presentation/manageWishlist/manageWishlist.tpl.html',
      controller: 'CtrlManageWishlist'
    });
  }]);

angular.module('atlasAdmin.menu', [
  'atlasAdmin.services.users',
  'atlasAdmin.services.groups'
]);

'use strict';

angular.module('atlasAdmin.profile', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/profile', {
      templateUrl: 'app/presentation/profile/profile.tpl.html',
      controller: 'ProfileController'
    });
  }]);

'use strict';

angular.module('atlasAdmin.scrubbables', [
    'ngRoute',
    'atlasAdmin.directives.scrubber',
    'atlasAdmin.directives.atlasSearch',
    'atlasAdmin.services.scrubbables'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/scrubbables', {
      templateUrl: 'app/presentation/scrubbables/create.tpl.html',
      controller: 'CtrlBBCScrubbables'
    });
    $routeProvider.when('/scrubbables/:atlasId', {
      templateUrl: 'app/presentation/scrubbables/create.tpl.html',
      controller: 'CtrlBBCScrubbables'
    });
  }]);

'use strict';

angular.module('atlasAdmin.terms', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/terms', {
      templateUrl: 'app/presentation/terms/terms.tpl.html',
      controller: 'UserLicenseController'
    });
  }]);

'use strict';

angular.module('atlasAdmin.requestSource', [
    'ngRoute',
    'atlasAdmin.services.applications',
    'atlasAdmin.services.payments',
    'atlasAdmin.services.sourceRequests',
    'atlasAdmin.services.sourceLicenses',
    'atlasAdmin.services.users'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/applications/:applicationId/requestSource/:sourceId', {
      templateUrl: 'app/presentation/requestSource/requestSource.tpl.html',
      controller: 'CtrlRequestSource'
    });
  }]);

'use strict';

angular.module('atlasAdmin.videoSourceProviders', [
    'ngRoute',
    'atlasAdmin.services.uservideosources'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/videosource/providers', {
      templateUrl: 'app/presentation/videoSourceProviders/videoSourceProviders.tpl.html',
      controller: 'CtrlVideoSourceProviders'
    });
  }]);

'use strict';

angular.module('atlasAdmin.videoSourceConfig', [
    'ngRoute',
    'atlasAdmin.services.uservideosources'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/videosource/config/youtube', {
      templateUrl: 'app/presentation/videoSourceConfig/videoSourceConfig.tpl.html',
      controller: 'CtrlVideoSourceYouTubeConfig'
    });
  }]);

'use strict';

angular.module('atlasAdmin.wishlist', [
    'ngRoute',
    'atlasAdmin.directives.inputMorph',
    'atlasAdmin.services.users',
    'atlasAdmin.services.propositions',
    'atlasAdmin.services.wishes'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/wishlist', {
      templateUrl: 'app/presentation/wishlist/wishlist.tpl.html',
      controller: 'CtrlWishlist'
    });
  }]);

angular.module('atlasAdmin.directives.actionModal', []);

angular.module('atlasAdmin.directives.activePath', ['atlasAdmin.services.profileStatus']);

var app = angular.module('atlasAdmin.directives.atlasSearch', [
  'atlasAdmin.services.scrubbableHelpers',
  'atlasAdmin.services.scrubbables',
  'atlasAdmin.services.groups'
]);

angular.module('atlasAdmin.directives.changeStatus', [
  'atlasAdmin.services.propositions'
]);

angular.module('atlasAdmin.directives.deleteItem', [
  'atlasAdmin.services.propositions'
]);

angular.module('atlasAdmin.directives.focus', []);

angular.module('atlasAdmin.directives.inputMorph', []);

angular.module('atlasAdmin.directives.loadContent', [
  'atlasAdmin.services.feeds'
]);

angular.module('atlasAdmin.directives.orderable', []);

angular.module('atlasAdmin.directives.preloader', []);

angular.module('atlasAdmin.directives.reduxVideo', [
  'atlasAdmin.services.bbcRedux',
  'atlasAdmin.services.groups'
]);

angular.module('atlasAdmin.directives.scrubber', []);

angular.module('atlasAdmin.directives.showSegments', []);

angular.module('atlasAdmin.directives.validUsage', []);

'use strict';
angular.module('atlasAdmin.interceptors.auth', []);

'use strict';

angular.module('atlasAdmin.interceptors.loading', []);

'use strict';

angular.module('atlasAdmin.interceptors.profileComplete', [
  'atlasAdmin.services.profileStatus'
]);

'use strict';
angular.module('atlasAdmin.services.applications', []);

'use strict';

angular.module('atlasAdmin.services.apiUsage', []);

'use strict';
angular.module('atlasAdmin.services.atlas', []);

'use strict';

angular.module('atlasAdmin.services.auth', ['atlasAdmin.services.profileStatus']);

'use script';

angular.module('atlasAdmin.services.bbcRedux', [
  'atlasAdmin.services.groups'
]);

'use strict';

angular.module('atlasAdmin.services.feeds', []);

'use strict';

angular.module('atlasAdmin.services.groups', []);

'use strict';
angular.module('atlasAdmin.services.payments', []);

'use strict';

angular.module('atlasAdmin.services.profileStatus', []);

'use strict';
angular.module('atlasAdmin.services.propositions', []);

'use strict';

angular.module('atlasAdmin.services.scrubbableHelpers', []);

'use strict';
angular.module('atlasAdmin.services.sourceLicenses', []);

'use strict';

angular.module('atlasAdmin.services.scrubbables', [
  'atlasAdmin.services.groups'
]);

angular.module('atlasAdmin.services.sourceRequests', ['atlasAdmin.services.users']);

'use strict';

angular.module('atlasAdmin.services.sources', []);

'use strict';

angular.module('atlasAdmin.services.uservideosources', []);

angular.module('atlasAdmin.services.users', [
  'atlasAdmin.services.atlas',
  'atlasAdmin.services.profileStatus'
]);

'use strict';

angular.module('atlasAdmin.services.wishes', []);

'use strict';

// Declare app level module which depends on filters, and services
angular.module('atlasAdmin')
  .config(['$routeProvider', '$httpProvider', '$sceDelegateProvider', function($routeProvider, $httpProvider, $sceDelegateProvider) {
      $routeProvider.otherwise({redirectTo: '/applications'});

      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.interceptors.push('LoadingInterceptor');
      $httpProvider.interceptors.push('AuthenticationInterceptor');
      $httpProvider.interceptors.push('ProfileCompleteInterceptor');

      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.metabroadcast.com/**',
        'https://*.metabroadcast.com/**'
      ]);
  }]);

/*
 * Populate the values in the template below and remove .template
 * from the filename to configure the application
 * Atlas Host e.g. "http://stage.atlas.metabroadcast.com"
 * Atlas version e.g. "4"
 * Atlas API Host e.g. "http://atlas-admin-backend.stage.metabroadcast.com/api"
 * Atlas Backend URL e.g. "http://admin-backend-stage.metabroadcast.com"
 * Admin user URL e.g. "http://admin-backend-stage.metabroadcast.com/1/user"
 */
// angular.module('atlasAdminConfig', [])
//     .value('atlasHost','http://atlas.metabroadcast.com')
//     .value('atlasVersion', '4')
//     .value('atlasApiHost', 'http://atlas-admin-backend.metabroadcast.com/api')
//     .value('adminBackendUrl', 'http://admin-backend-stage.metabroadcast.com')
//     .value('userUrl', 'http://admin-backend-stage.metabroadcast.com/1/user');

angular.module('atlasAdminConfig', [])
  .value('atlasHost', 'http://stage.atlas.metabroadcast.com')
  .value('atlasVersion', '4')
  .value('atlasApiHost', 'http://atlas-admin-backend.stage.metabroadcast.com/api')
  .value('adminBackendUrl', 'http://admin-backend-stage.metabroadcast.com')
  .value('userUrl', 'http://admin-backend-stage.metabroadcast.com/1/user');

'use strict';

/* Filters */

angular.module('atlasAdmin.filters').
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

angular.module('atlasAdmin.application')
.controller('CtrlApplicationEdit', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', 'SourceLicenses', 'Authentication', 'atlasApiHost', '$modal', '$sce', '$log', '$http', '$q', 'APIUsage', 'Atlas', '$location',
    function($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, Authentication, atlasApiHost, $modal, $sce, $log, $http, $q, Usage, Atlas, $location) {

    $scope.app = {};
    $scope.app.edited = {};
    $scope.app.edited = {'meta':false,'precedenceState':false,'precedenceOrder':false};
    $scope.app.changed = false;
    var leavingPageText = 'You have unsaved changes!';
    $scope.view_title = 'Edit application';

    $scope.isAdmin = false;

    Atlas.getRequest('/auth/user.json').then(function (result) {
        if (result.data.user.role === 'admin') {
            $scope.isAdmin = true;
        }
    });

    window.onbeforeunload = function() {
        if ($scope.app.changed) {
            return leavingPageText;
        }
    };

    var showLoadingState = function () {
        $('.usage-graph-wrapper').addClass('loading');
        $('#visualisation').empty();
    };

    var removeLoadingState = function () {
        $('.usage-graph-wrapper').removeClass('loading');
    };

    $scope.switchTime = function (timeRange) {
        getApiKey(timeRange);
    };

    var getApiKey = function (timeRange) {
        // Seems to be the only way to find out the current API key
        Applications.get($routeParams.applicationId).then(function (application) {
            $scope.app.application = application;
            $scope.app.writes = {};
            $scope.app.writes.predicate = 'name';
            $scope.app.writes.reverse = false;
            $scope.view_subtitle = application.title;
            var apiKey = application.credentials.apiKey;
            loadGraph(apiKey, timeRange);
        });
    };

    var loadGraph = function (apiKey, timeRange) {
        switch(timeRange) {
            case 'hour':
                loadGraphHour(apiKey);
                break;
            case 'day':
                loadGraphDay(apiKey);
                break;
            case 'week':
                loadGraphWeek(apiKey);
                break;
            case 'month':
                loadGraphMonth(apiKey);
        }
    };

    var makeGraph = function (barData) {
        if (barData.length > 0) {
            if ($('.no-usage-message')) {
                $('.no-usage-message').remove();
            }
            barData.forEach(function (d) {
                d.x = d.time;
                d.y = d.count;
            });
            var vis = d3.select('#visualisation');
            var WIDTH = 1000;
            var HEIGHT = 500;
            var MARGINS = {
                top: 20,
                right: 20,
                bottom: 21,
                left: 50
            };
            var xRange = d3.scale.ordinal()
                .rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1)
                .domain(barData.map(function(d) {
                    return d.x;
                }));
            var yRange = d3.scale.linear()
                .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                .domain([0, d3.max(barData, function(d) {
                    return d.y;
                })]);
            var xAxis = d3.svg.axis()
                .scale(xRange)
                .tickSize(1)
                .tickSubdivide(true);
            var yAxis = d3.svg.axis()
                .scale(yRange)
                .tickSize(1)
                .orient('left')
                .tickSubdivide(true);
            vis.append('svg:g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
                .call(xAxis);
            vis.append('svg:g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
                .call(yAxis);
            vis.selectAll('rect')
                .data(barData)
                .enter()
                .append('rect')
                .attr('x', function (d) { // sets the x position of the bar
                    return xRange(d.x);
                })
                .attr('y', function (d) { // sets the y position of the bar
                    return yRange(d.y);
                })
                .attr('width', xRange.rangeBand()) // sets the width of bar
                .attr('height', function (d) {      // sets the height of bar
                    return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
                })
                .attr('class', 'bar-col');
            vis.selectAll('.x text')
                .attr('dy', '1')
                .attr('x', '-6');
            vis.selectAll('.y text')
                .attr('dy', '1')
                .attr('x', '-6');
        } else {
            $('.usage-graph').before('<p class="no-usage-message">No usage in that time period</p>');
        }
    };

    var loadGraphHour = function (apiKey) {
        var _key = apiKey || '';
        $location.search({usage: 'hour'});
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'hour';
            $('.graph-caption').text('API requests over the past hour');
            Usage.hour(_key).then(function (data) {
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('HH:mm');
                    d.time = formattedDate;
                });
                makeGraph(data);
                removeLoadingState();
            }, function (err) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
        var timeoutDuration = 300000; // 5 mins
        var graphTimeout = setTimeout(function () {
            $scope.reloadGraph();
            clearTimeout(graphTimeout);
        }, timeoutDuration);
    };

    var loadGraphDay = function (apiKey) {
        var _key = apiKey || '';
        $location.search({usage: 'day'});
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'day';
            $('.graph-caption').text('API requests over the past day');
            Usage.day(_key).then(function (data) {
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('HH');
                    d.time = formattedDate + ':00';
                });
                makeGraph(data);
                removeLoadingState();
            }, function (error) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };

    var loadGraphWeek = function (apiKey) {
        var _key = apiKey || '';
        $location.search({usage: 'week'});
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'week';
            $('.graph-caption').text('API requests over the past week');
            Usage.week(_key).then(function (data) {
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('Do MMMM');
                    d.time = formattedDate;
                });
                makeGraph(data);
                removeLoadingState();
            }, function (error) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };

    var loadGraphMonth = function (apiKey) {
        var _key = apiKey || '';
        $location.search({usage: 'month'});
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'month';
            $('.graph-caption').text('API requests over the past month');
            Usage.month(_key).then(function (data) {
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('Do MMMM');
                    d.time = formattedDate;
                });
                makeGraph(data);
                removeLoadingState();
            }, function (error) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };

    var closeUsageGraph = function () {
        $('.close-usage-graph').on('click', function () {
            $('.chart-card').slideUp('fast');
        });
    };

    var toggleUsageGraph = function () {
        $('.api-usage-trigger').on('click', function () {
            var $graphContainer = $('.chart-card');
            if ($graphContainer.is(':visible')) {
                $graphContainer.slideUp('fast');
            } else {
                if ($('.usage-graph g').length <= 0) {
                    getApiKey('week');
                }
                $graphContainer.slideDown('fast');
            }
        });
    };

    var openGraphFromUrl = function () {
        var timePeriod = $location.search().usage;
        var $graphContainer = $('.chart-card');
        if (timePeriod) {
            if ($graphContainer.is(':hidden')) {
                $graphContainer.slideDown('fast');
            }
            getApiKey(timePeriod);
        }
    };

    $scope.reloadGraph = function () {
        var timePeriod = $location.search().usage;
        getApiKey(timePeriod);
    };

    toggleUsageGraph();
    closeUsageGraph();
    openGraphFromUrl();

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
            templateUrl: 'app/presentation/applications/sourceRequestModal/sourceRequestModal.tpl.html',
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
            templateUrl: 'app/presentation/application/viewTermsModal.tpl.html',
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

angular.module('atlasAdmin.applications')
.controller('CtrlApplications', ['$scope', '$rootScope', '$routeParams', 'Applications', '$modal', '$location', 'Atlas', 'Authentication', 'atlasApiHost', '$http',
    function($scope, $rootScope, $routeParams, Applications, $modal, $location, Atlas, Authentication, atlasApiHost, $http) {

    $scope.view_title = 'My Applications';
    $scope.app = {};
    $scope.app.predicate = 'created';
    $scope.app.reverse = true;
    $scope.app.pageSize = 10;
    $scope.app.currentPage = 1;
    $scope.isAdmin = false;

    Atlas.getRequest('/auth/user.json').then(function (result) {
        if (result.data.user.role === 'admin') {
            $scope.isAdmin = true;
        }
    });

    var getUsageData = function (applications) {
        var TIME_PERIOD = 8;
        var dates = [];
        for (var i = 0, ii = TIME_PERIOD; i < ii; i++) {
          dates.push('logstash-atlas-access-' + moment().subtract(i, 'days').format('YYYY.MM.DD'));
        }
        dates = dates.join(',');
        var numberWithCommas = function (x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };
        $http.get(Authentication.appendTokenToUrl(atlasApiHost + '/usage-list/' + dates)).then(function (response) {
            var usageData =  _.has(response, 'data') ? response.data.aggregations.apiKeys.buckets : null;

            if (! usageData) {
              console.warn('Response data doesnt have the `data` property', response);
              return;
            }

            _.forEach(usageData, function (d) {
                d.readableCount = numberWithCommas(d.doc_count);
            });
            applications = handleNullUsage(applications);
            mapUsageDataToApplications(applications, usageData);
        });
    };

    var handleNullUsage = function (applications) {
        _.forEach(applications, function (application) {
            application.usage = {
                doc_count: 0,
                readableCount: 0
            };
        });
        return applications;
    };

    var mapUsageDataToApplications = function (applications, usageData) {
        applications = _.map(applications, function (application) {
            _.forEach(usageData, function (d) {
                if (application.credentials.apiKey === d.key) {
                    application.usage = d;
                }
            });
        });
    };

    // retreive a list of all apps
    Applications.all().then(function(applications) {
        $scope.app.applications = applications;
        $scope.state = (applications.length) ? 'table' : 'blank';
        getUsageData(applications);
    });

    // instantiate a new modal window
    $scope.createApplication = function() {
        var modalInstance = $modal.open({
            templateUrl: 'app/presentation/applications/createModal/applicationCreateModal.tpl.html',
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

angular.module('atlasAdmin.auth')
  .controller('CtrlOAuth', function($scope, $rootScope, $routeParams, $location, Authentication, Atlas, $log, Users) {
    if (window.location.search.indexOf("code") == -1 &&  window.location.search.indexOf("oauth") == -1) {
        // search part will be empty if we have been here and cleared the oauth replies
        // In this case redirect.
        $location.path("/applications");
        return;
    }

    $rootScope.title = "Signing in...";
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

    Atlas.getAccessToken(oauth_token, oauth_verifier, code)
        .then(function(results) {
        if (!results.data.oauth_result) {
            return;
        }
        Authentication.setToken(results.data.oauth_result.access_token);
        var redirectToSources = function() {
            window.location.search = "";
        };
        Users.currentUser(function (user) {
            redirectToSources();
        });
    },

    function(error) {
        $log.error("Error getting access token.");
        $log.error(error);
        $location.hash("/login");
    });
});

'use strict';
angular.module('atlasAdmin.contact')
  .controller('ContactController', ['$scope', '$rootScope', '$sce', 'Users', 'GroupsService', '$q',
    function($scope, $rootScope, $sce, Users, Groups, $q) {
      $rootScope.view_title = 'Contact Us';
      var privateItems;

      Users.currentUser(function (user) {
        $scope.user = user;

        var getPrivateMenuItems = function() {
          var defer = $q.defer();
          if (privateItems) {
            defer.resolve(privateItems);
            return defer.promise;
          }
          Groups.get().then(function(result) {
            privateItems = result;
            defer.resolve(privateItems);
          });
          return defer.promise;
        };

        getPrivateMenuItems().then(function(groups) {
          new window.MBST.Contact('stage', {
            product: 'atlas',
            fields: (function () {
              var result = [];

              var subjects = [];

              var tools = [];
              if (groups.length > 0) {
                groups.forEach(function (tool) {
                  tools.push({
                    name: tool.name,
                    value: tool.name
                  });
                });
              }

              if (tools.length > 0) {
                subjects.push({
                  type: 'group',
                  name: 'My Tools',
                  options: tools
                });
              }

              subjects = subjects.concat([
                {
                  name: 'data_access',
                  value: 'Data Access'
                },
                {
                  name: 'api_calls',
                  value: 'API Calls'
                },
                {
                  name: 'api_explorer',
                  value: 'API Explorer'
                },
                {
                  name: 'feature_request',
                  value: 'Feature Request'
                },
                {
                  name: 'usage_changes',
                  value: 'Usage Changes'
                },
                {
                  name: 'other',
                  value: 'Other'
                }
              ]);

              var groupsInput = [{
                type: 'select',
                label: 'Subject',
                attrs: {
                  required: 'required',
                  name: 'subject',
                  options: subjects
                }
              }];


              var applications = [];
              applications.push({
                name: '',
                value: ''
              });

              user.applications.forEach(function (application) {
                applications.push({
                  name: application,
                  value: application
                })
              });

              var applicationsInput = [{
                type: 'select',
                label: 'Application ID',
                attrs: {
                  options: applications
                }
              }];
              var commonInputs = [{
                type: 'textarea',
                label: 'Message (500 Characters)',
                attrs: {
                  required: 'required',
                  name: 'message',
                  rows: 4,
                  maxLength: 500
                },
                value: '',
                description: 'Include URL, API Call, data source name etc.'
              }];

              if (groups.length > 0) {
                result = result.concat(groupsInput);
              }

              if (applications.length > 0) {
                result = result.concat(applicationsInput);
              }

              result = result.concat(commonInputs);

              return result;
            })()
          }, function ($form) {
            $scope.formEle = $sce.trustAsHtml('<iframe id="contactFrame" src="about:blank" style="width: 100%;' +
              'height: 320px; border: 0 none;"></iframe>');
            $scope.$apply();

            var doc = document.getElementById('contactFrame').contentWindow.document;
            doc.open();
            var stylesheets = document.head.querySelectorAll('link');
            var parent = document.createElement('body');
            parent.classList.add('form-row');
            parent.setAttribute('style', 'margin-bottom: 0');
            for (var i = 0, ii = stylesheets.length; i < ii; i += 1) {
              var sheetEle = document.createElement('link');
              sheetEle.setAttribute('rel', 'stylesheet');
              sheetEle.setAttribute('type', 'text/css');
              sheetEle.setAttribute('href', stylesheets[i].href);

              parent.appendChild(sheetEle);
            }
            parent.appendChild($form);
            doc.appendChild(parent);
            doc.close();

          });
        });
      });
    }
  ]);

'use strict';

angular.module('atlasAdmin.epg')
  .controller('CtrlEPGWidget', ['$scope', '$rootScope', 'Users', '$routeParams', '$q', '$http', 'Authentication', 'atlasApiHost',
    function($scope, $rootScope, Users, $routeParams, $q, $http, Authentication, atlasApiHost) {
    var subdomain = window.location.hostname.split('.')[0],
        _env = (subdomain === 'stage' || subdomain === 'dev')? '-stage' : '';
    $scope.view_title = "";
    $scope.widget = false;
    $scope.widgetURL = '';

    $http.get( Authentication.appendTokenToUrl(atlasApiHost +'/user/groups') )
    .success(function(groups, status) {
        var groupname, key;
        for ( var g in groups ) {
            groupname = groups[g].name;
            if (groupname === 'BTBlackout') {
                key = groups[g].data.apiKey || null;
                if (key) {
                    $scope.view_title = "BT Blackout";
                    $scope.widget = true;
                    $scope.widgetURL = '//widgets'+_env+'.metabroadcast.com/loader/1/btblackout.html?apiKey='+key;
                }
            }
        }
    })
}]);

'use strict';

angular.module('atlasAdmin.error')
  .controller('ErrorController', function($scope, $rootScope, $routeParams) {
      $rootScope.title = "Sorry, there was a problem....";
      $scope.alerts = [];
      if ($routeParams.type == "forbidden") {
          $scope.alerts.push({type:"danger", msg: "You do not have access to this resource"});
      } else if ($routeParams.type == "not_available") {
          $scope.alerts.push({type:"info", msg: "This service is not currently available. Please try again later."});
      }
  });

'use strict';
angular.module('atlasAdmin.feedBreakdown')
  .controller('CtrlFeedsBreakdown', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modal',
    function($scope, $rootScope, $routeParams, Feeds, $q, $modal) {
      $scope.taskID = $routeParams.taskId;

      $scope.showDetails = function() {
        var modalInstance = $modal.open({
          templateUrl: 'app/presentation/feedBreakdown/statusDetailModal/statusDetailModal.tpl.html',
          controller: 'CtrlStatusDetail',
          scope: $scope
        });
        modalInstance.result.then(function() {

        });
      };

      var loadTask = function() {
        Feeds.request('youview/bbc_nitro/tasks/'+$routeParams.taskId+'.json?annotations=remote_responses')
        .then(function(task) {
          var _task = task.tasks[0];
          $scope.task = _task;
          $scope.view_title = "Breakdown for transaction: "+_task.remote_id;
        });
      };
      loadTask();

    }]);

'use strict';
angular.module('atlasAdmin.feed')
  .controller('CtrlFeedsConsole', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$timeout',
    function($scope, $rootScope, $routeParams, Feeds, $q, $timeout) {
      $scope.tasks = [];
      $scope.error = {};
      $scope.error.show = false;
      $scope.view_title = 'Feeds Console';
      $scope.statusFilter = ['accepted', 'validating', 'failed', 'quarantined', 'committing', 'committed', 'publishing', 'published'];
      $scope.transactionFilter = ['BRAND', 'SERIES', 'ITEM', 'VERSION', 'BROADCAST', 'ONDEMAND'];

      // set up ordering and search
      $scope.table = {};
      $scope.table.order = 'upload_time';
      $scope.table.reverse = true;
      $scope.activeFilter = '';
      $scope.search = {};


      // this controls the loading state of the feeds console
      $scope.isloading = false;

      // this will tell the view whether or not the action buttons are disabled
      $scope.disableActions = false;


      // Used for initiating filtering on a field. changes the activeFilter
      // param and then reloads the tasks list.
      //
      // @param filter_on {string} value to set for activeFilter
      //
      var input_timer;
      $scope.filter = function(filter_on) {
        if (! _.isString(filter_on)) {
          return;
        }

        if ($scope.search[filter_on].length > 3 || $scope.search[filter_on].length === 0) {
          $timeout.cancel(input_timer);
          input_timer = $timeout(function() {
            $scope.isloading = true;
            $scope.activeFilter = filter_on;
            $scope.page.current = 0;
            getTasks();
          }, 700);
        }
      };


      // Used for controlling pagination functionality. The idea is that
      // page.current is watched for changes, then the tasks list
      // is reloaded from the server with new offset params
      $scope.page = {};
      $scope.page.current = 0;
      $scope.page.limit = 15;
      $scope.page.offset = 0;
      $scope.page.showPager = false;

      $scope.$watch('page.limit', function(new_val, old_val) {
        $scope.isloading = true;
        $scope.page.current = 0;
        $scope.page.showPager = ($scope.tasks.length >= $scope.page.limit) ? false : true;
      });

      $scope.$watch('page.current + page.limit', function(new_val, old_val) {
        $scope.page.offset = $scope.page.current * $scope.page.limit;
        getTasks();
      });

      $scope.page.next = function() {
        if ($scope.tasks.length >= $scope.page.limit && !$scope.isloading) {
          $scope.isloading = true;
          ++$scope.page.current;
        }
      };

      $scope.page.previous = function() {
        if ($scope.page.current > 0 && !$scope.isloading) {
          $scope.isloading = true;
          --$scope.page.current;
        }
      };


      // For loading sets of tasks from atlas. Filters and offsets
      // are inserted automatically based on $scope variables
      var getTasks = function() {
        var _filter = '';
        if ($scope.activeFilter === 'transaction' && ! _.isEmpty($scope.search.transaction)) {
          _filter = '&type='+$scope.search.transaction.toLowerCase();
        }else if ($scope.activeFilter === 'uri' && ! _.isEmpty($scope.search.uri)) {
          _filter = '&uri='+$scope.search.uri;
        }else if ($scope.activeFilter === 'status' && ! _.isEmpty($scope.search.status)) {
          _filter = '&status='+$scope.search.status;
        }else if ($scope.activeFilter === 'remote_id' && ! _.isEmpty($scope.search.remote_id)){
          _filter = '&remote_id='+$scope.search.remote_id;
        }
        var request_url = 'youview/bbc_nitro/tasks.json?limit='+$scope.page.limit+'&offset='+$scope.page.offset+_filter;
        Feeds.request(request_url).then(pushTasksTable);
      };


      // For loading the feed statistics from atlas
      var getStats = (function() {
        Feeds.request('youview/bbc_nitro/statistics.json').then(function(data) {
          if (! data.feed_stats) {
            return;
          }
          var stats = data.feed_stats[0];
          $scope.statistics = {};
          $scope.statistics.queue_size = stats.queue_size;
          $scope.statistics.uptime = stats.update_latency_string;
        });
      })();

      // Used for loading data into the tasks scope
      // @param data {object} the tasks object
      var pushTasksTable = function(data) {
        if (_.isObject(data.error)) {
          $scope.error.show = true;
          $scope.error.obj = data.error;
          return;
        }
        $scope.isloading = false;
        $scope.tasks = data.tasks;
      };

      // Used for calculating uptime since last outage
      // @param last_outage {date}
      var calculateUptime = function(last_outage) {
        var _now = new Date(),
        _then = last_outage,
        _delta = Math.round(Math.abs((_now.getTime() - _then.getTime()))/(24*60*60*1000));
        return _delta.toString();
      };
    }]);

'use strict';
angular.module('atlasAdmin.feeds')
  .controller('CtrlFeeds', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q',
    function($scope, $rootScope, $routeParams, Feeds, $q) {
    $scope.view_title = 'Feeds';

    Feeds.get().then(
    function(data) {
      if (_.isEmpty(data)) {
        return console.warn('No feed data returned');
      }
      $scope.feeds = data;
    });
}]);

'use strict';
angular.module('atlasAdmin.login')
  .controller('CtrlLogin', function($scope, $rootScope, $rootElement, $routeParams, Atlas, atlasVersion, $location, Authentication, $log) {
    $scope.title = "Hi there, please sign in to continue";

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

'use strict';

angular.module('atlasAdmin.logout')
  .controller('CtrlLogout', function($scope, $rootScope, $routeParams, $location, Authentication) {
      // Ask atlas for access here
      $rootScope.title = "Logging out";
      Authentication.reset();
      $location.path("/login");
  });

'use strict'
angular.module('atlasAdmin.manageRequests')
  .controller('CtrlManageSourceRequests', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Users', 'sourceRequests', '$location',
    function($scope, $rootScope, $routeParams, Applications, Users, sourceRequests, $location) {
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
        sourceRequests.putChangeRequest(payload).then(function(status) {
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
    sourceRequests.getUnapprovedRequests().then(function(data) {
        $scope.app.requests = data;
    });
}]);

'use strict';
angular.module('atlasAdmin.manageSources')
  .controller('CtrlSources', function($scope, $rootScope, $routeParams, Sources) {
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

'use strict';

angular.module('atlasAdmin.manageSourcesReaders')
  .controller('CtrlSourceReaders', function($scope, $rootScope, $routeParams, Sources, Applications) {
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

'use strict';

angular.module('atlasAdmin.manageSourcesWriters')
  .controller('CtrlSourceWriters', function($scope, $rootScope, $routeParams, Sources, Applications, $modal) {
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

    $scope.addWriterDialog = function () {
      var modalInstance = $modal.open({
        templateUrl: 'app/presentation/manageSourcesWriters/addWriterModal/addWriterModal.html',
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
  });

'use strict';

angular.module('atlasAdmin.manageUsage')
  .controller('CtrlUsage', ['$scope', '$rootScope', 'Authentication', 'atlasApiHost', '$http', function($scope, $rootScope, Authentication, atlasApiHost, $http) {
    var getUsageData = function () {
      var TIME_PERIOD = 8;
      var dates = [];

      for (var i = 0, ii = TIME_PERIOD; i < ii; i++) {
        dates.push('logstash-atlas-access-' + moment().subtract(i, 'days').format('YYYY.MM.DD'));
      }

      dates = dates.join(',');

      var numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };

      $http.get(Authentication.appendTokenToUrl(atlasApiHost + '/usage-list/' + dates)).then(function (response) {
        var usageData =  _.has(response, 'data') ? response.data.aggregations.apiKeys.buckets : null;

        if (! usageData) {
          console.warn('Response data doesnt have the `data` property', response);
          return;
        }

        _.forEach(usageData, function (d) {
          d.readableCount = numberWithCommas(d.doc_count);
        });
        $scope.requests = usageData;
      });
    };

    getUsageData();
  }]);

angular.module('atlasAdmin.manageUser')
  .controller('UserProfileController', function($scope, $rootScope, $routeParams, Users, Applications, $location) {
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
      
      Users.get($routeParams.uid).then(function(user) {
          $scope.app.user = user;
          var title = 'Profile for ';
          if (user.full_name) {
              title += user.full_name;
          } else {
              title += 'user id ' + user.id;
          }
          $rootScope.view_title = title;
          Users.currentUser(function(editingUser) {
              $scope.app.isAdmin = editingUser.role === 'admin';
              $scope.app.editingUser = editingUser.id;

              if ($scope.app.isAdmin) {
                  populateApplications($scope.app.user.applications);
              }
          });
      });

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

angular.module('atlasAdmin.manageUsers')
  .controller('AllUsersController', function($scope, $rootScope, $routeParams, Users) {
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

angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlist', ['$scope', '$rootScope', 'factoryPropositions', 'Wishes',
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
  }]);

// date helpers
var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlistFeatureRequests', [ '$scope', '$rootScope',
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
  }]);

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
            templateUrl: 'app/presentation/manageWishlist/newWishlistItemModal/newWishlistItemModal.tpl.html',
            controller: 'CtrlNewWishlistItemModal',
            scope: $scope
        })
        .result.then(function(data) {
            $scope.features.push(data);
        });
    }
}]);

'use strict';

// date helpers
var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlistSourceRequests', [ '$scope', '$rootScope',
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
  }]);

angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlManageWishlistSources', ['$scope', '$rootScope', '$modal',
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
            templateUrl: 'app/presentation/manageWishlist/newWishlistItemModal/newWishlistItemModal.tpl.html',
            controller: 'CtrlNewWishlistItemModal',
            scope: $scope
        })
        .result.then(function(data) {
            $scope.sources.push(data);
        });
    }
  }]);

'use strict';

angular.module('atlasAdmin.menu')
  .controller('UserMenuController', ['$scope', 'Users', '$rootScope', 'Authentication', '$location', 'GroupsService', '$q',
    function($scope, Users, $rootScope, Authentication, $location, Groups, $q) {
    var privateItems;
    $scope.app = {};
    $scope.app.dropdown = true;
    $scope.app.adminMenu = true;
    $scope.app.contentMenu = true;
    $scope.app.appsMenu = true;

    $scope.app.showDropdown = function () {
        $scope.app.dropdown = true;
    };

    $scope.app.showAdminMenu = function () {
        $scope.app.adminMenu = true;
    };

    $scope.app.showContentMenu = function () {
        $scope.app.contentMenu = true;
    };

    $scope.app.showAppsMenu = function () {
        $scope.app.appsMenu = true;
    };

    $scope.app.hideDropdown = function () {
        $scope.app.dropdown = false;
    };

    $scope.app.hideAdminMenu = function () {
        $scope.app.adminMenu = false;
    };

    $scope.app.hideContentMenu = function () {
        $scope.app.contentMenu = false;
    };

    $scope.app.hideAppsMenu = function () {
        $scope.app.appsMenu = false;
    };

    var getPrivateMenuItems = function() {
        var defer = $q.defer();
        if (privateItems) {
            defer.resolve(privateItems)
            return defer.promise;
        }
        Groups.get().then(function(result) {
             privateItems = result;
             defer.resolve(privateItems);
        })
        return defer.promise;
    }

    var buildMenu = function(user, groups) {
        // if profile not complete the do not show menu
        var allMenu = [
            // admin only
            {path:'/manage/sources', label:'Sources', role:'admin'},
            {path:'/manage/requests', label:'Requests', role:'admin'},
            {path:'/manage/users', label:'Users', role:'admin'},
            {path:'/manage/usage', label:'API Usage', role:'admin'},
            {path:'/manage/wishlist', label:'Wishlist', role:'admin'}];

        if (_.isArray(groups)) {
            groups.forEach(function(item) {
                if (item.name === 'BTBlackout') { allMenu.push({path: '/epg/bt-tv', label: 'EPG'}); }
                if (item.name === 'BBC-YV-Feed') { allMenu.push({path: '/feeds', label: 'Feeds'}); }
                if (item.name === 'BBC-Scrubbables') { allMenu.push({path: '/scrubbables', label: 'Scrubbables'}); }
            })
        }

        // build the menu
        var menu = [];
        var admin_menu = [];
        for (var i = 0; i < allMenu.length; i++) {
            var item = allMenu[i];
            if (!item.hasOwnProperty('role') || item.role === 'regular') {
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
        Users.currentUser(function(user) {
            $scope.app.user = user;
            // find any custom menu items for this user
            getPrivateMenuItems().then(function(groups) {
                $scope.app.userGroups = groups;
                $scope.app.menu = buildMenu(user, groups);
            },
            function() {
                $scope.app.menu = buildMenu(user);
            });
        });
    }
}]);

angular.module('atlasAdmin.profile')
  .controller('ProfileController', function($scope, $rootScope, $routeParams, Users, Applications, $location) {
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


      Users.currentUser(function(user) {
        $scope.app.user = user;
        $rootScope.view_title = 'Your profile';
      });

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

'use strict';

angular.module('atlasAdmin.scrubbables')
  .controller('CtrlBBCScrubbables', ['$scope', '$rootScope', '$routeParams', '$q', 'BBCScrubbablesService', '$timeout', 'ScrubbablesHelpers',
    function($scope, $rootScope, $routeParams, $q, Scrubbables, $timeout, Helpers) {
      $scope.view_title = 'TV linker';
      $scope.showUI = false;
      $scope.loading = false;
      $scope.item = {};
      $scope.showSegments = {};
      $scope.atlasSearch = {};
      $scope.scrubber = {};

      // Grab api keys and keep in scope for later
      Scrubbables.keys().then(function(keys) {
        $scope.searchKey = keys.owlRead;
        $scope.writeKey = keys.owlWrite;
        $scope.deerKey = keys.deerRead;
        // load previous item if there exists an id in the url
        if ($routeParams.atlasId) {
          loadAtlasItem($routeParams.atlasId);
        }
      },
      function(err) {
        console.error(err);
      });


      var calculateSegmentDuration = function(start, end, broadcastDuration) {
        return (broadcastDuration - start) - (broadcastDuration - end);
      };


      $scope.generateID = function() {
        return Math.random().toString(36).substr(2, 9);
      };


      var showMessage = function(message, type) {
        var _timer;
        _type = type || 'normal';
        $scope.message = message;
        $scope.showMessage = true;
        _timer = $timeout(function() {
          $scope.message = '';
          $scope.showMessage = false;
        }, 7000);
      };


      // This is for loading the saved segments and inserting them into the $scope
      //
      // @param result {Object} Deer result object
      var loadSavedSegments = function (result) {
        // try all possible content types:
        var TYPES = ['item', 'episode', 'film'];

        var _events = null;

        _.each(TYPES, function checkType(type) {
          if(_.has(result, type)) {
            if(_.has(result[type], 'segment_events')) {
              if(_.isArray(result[type].segment_events)) {
                _events = result[type].segment_events;
              }
              else {
                console.warn('segment_events on deer object is not an array');
              }
            }
            else {
              console.warn('segment_events missing on deer object');
            }
          }
        });

        return _events;
      };


      var loadAtlasItem = function (id) {
        if (!_.isString(id)) {
          return;
        }
        $scope.loading = true;

        // load related links from deer
        Scrubbables.deerContent($scope.deerKey, id).then(
        function(res) {
          // ..and load broadcast content from owl
          Scrubbables.content.id($scope.deerKey, id).then(
          function(item) {
            $scope.atlasSearch.selectedItem = Helpers.channelFilter(item.contents, 'cbbh')[0];
            $scope.scrubbableSegments = loadSavedSegments(res);
          },
          function(err) {
            console.error(err);
          });
        }, function(err) {
          console.error(err);
        });
      };


      var pushSegmentsToTimeline = function () {
        if (! _.isObject($scope.scrubbableSegments) ) {
          return;
        }
        var _events = $scope.scrubbableSegments;
        var broadcastDuration = _.has($scope.broadcast, 'published_duration') ? $scope.broadcast.published_duration : null;

        // Keeping this in for debugging
        console.log('ev', _events);

        if (!! broadcastDuration) {

          var showSegments = _.compact( _.map(_events, function (ev) {
            if (ev.offset === 0 && ev.segment.duration === broadcastDuration) {
              return ev;
            }
          }) );

          var timedSegments = _.compact( _.map(_events, function(ev) {
            if (ev.segment.duration < broadcastDuration) {
              return ev;
            }
          }) );

          if (showSegments.length) {
            $scope.showSegments.loadSegments(showSegments);
          }
          if (timedSegments.length) {
            $scope.scrubber.loadSegments(timedSegments);
          }
        }
      };


      // When the selectedItem object changes inside the search directive, then
      // update the UI with the new broadcast data
      $scope.$watch('atlasSearch.selectedItem', function() {
        if (!_.isEmpty($scope.atlasSearch.selectedItem)) {
          var _formatted = Helpers.formatResponse($scope.atlasSearch.selectedItem);
          $scope.item = _formatted;
          $scope.episode = $scope.atlasSearch.selectedItem;
          $scope.broadcast = $scope.episode.broadcasts[0];
          $scope.showUI = true;
          $scope.loading = false;
          pushSegmentsToTimeline();
          console.log($scope.episode);
        }
      });

      // Clear the stage of the current item
      $scope.killCurrent = function() {
        $scope.showUI = false;
        $scope.loading = false;
        $scope.item = {};
        $scope.showSegments = {};
        $scope.atlasSearch = {};
        $scope.scrubber = {};
      };

      // Create a new item
      $scope.createNew = function($event) {
        var $target = $($event.target);
        var _out = {};
        var _showLinks = _.union($scope.showSegments.segments, $scope.scrubber.segments);
        var _atlas = {
          id: $scope.episode.id,
          uri: $scope.episode.uri
        };
        var _segments = [];
        for (var i in _showLinks) {
          _segments.push({
            title: _showLinks[i].label,
            url: _showLinks[i].url,
            offset: _showLinks[i].startTime,
            duration: calculateSegmentDuration(_showLinks[i].startTime, _showLinks[i].endTime, $scope.broadcast.duration)
          });
        }
        _out.atlas = _atlas;
        _out.segments = _segments;

        $target.addClass('is-posting');
        $target.prop('disabled', 'true');

        Scrubbables.create($scope.writeKey, _out).then(
        function(contentId) {
          // after the item has been sent to atlas, clear all the things
          $scope.showUI = false;
          $scope.loading = false;
          $scope.item = {};
          $scope.showSegments = {};
          $scope.atlasSearch = {};
          $scope.scrubber = {};
          $target.removeClass('is-posting');
          $target.removeProp('disabled');
          showMessage('The item has been saved');

          Scrubbables.migrateContent(contentId);
        }, function(res) {
          console.error(res);
          showMessage('There was a problem sending the item to Atlas');
        });
      };
    }]);

angular.module('atlasAdmin.terms')
  .controller('UserLicenseController', function($scope, $rootScope, $routeParams, Users, $location, $window, $sce, $log, ProfileStatus) {
      // only try to get user if logged in
      $scope.view_title = 'Atlas Terms and Conditions'
      $scope.app = {};
      Users.currentUser(function(user) {
          $scope.app.user = user;
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
              ProfileStatus.setLicenseAccepted(true);
              $location.path('/profile');
          }, error);
      }

      $scope.app.reject = function() {
          $location.path('/logout');
      };
  });

'use strict';
angular.module('atlasAdmin.requestSource')
  .controller('CtrlRequestSource', ['$scope', '$rootScope', '$sce', '$routeParams', 'Applications', 'Users', 'Payments', 'sourceRequests', 'SourceLicenses', '$location',
    function( $scope, $rootScope, $sce, $routeParams, Applications, Users, Payments, sourceRequests, SourceLicenses, $location) {
        $scope.planData = Payments();
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
        Users.currentUser(function(user) {
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
            sourceRequests.postRequest(payload).then(function(status) {
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
angular.module('atlasAdmin.videoSourceProviders')
  .controller('CtrlVideoSourceProviders', function($scope, $rootScope, $location, UserVideoSources) {
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
angular.module('atlasAdmin.videoSourceConfig')
  .controller('CtrlVideoSourceYouTubeConfig', function($scope, $rootScope, UserVideoSources) {
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

    UserVideoSources.getChannels().then(function(data) {
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
        UserVideoSources.addPublisher(youTubeId, source.id).then(function(results) {
            UserVideoSources.addChannel(youTubeId, channelId).then(function(results) {
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
var app = angular.module('atlasAdmin.wishlist')
  .controller('CtrlWishlist', ['$scope', '$rootScope', '$routeParams', 'factoryPropositions', 'Wishes', 'Users', '$q', 
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
var app = angular.module('atlasAdmin.wishlist');

app.controller('CtrlWishlistFeatures', ['$scope', '$rootScope', '$routeParams', 'Wishes', '$q', '$modal',
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
            templateUrl: 'app/presentation/wishlist/customFeatureRequestModal/customFeatureRequestModal.tpl.html',
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

'use strict';

var app = angular.module('atlasAdmin.wishlist');

app.controller('CtrlWishlistSources', ['$scope', '$rootScope', '$routeParams', 'Wishes', '$q',
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

angular.module('atlasAdmin.directives.actionModal')
  .directive('actionModal', ['$document', '$q', '$modal',
    function($document, $q, $modal) {
      var controller = function($scope, el, attr) {
        var modal = function(action) {
          var defer = $q.defer();

          if (!_.isString(action)) {
            defer.reject();
            return defer.promise;
          }

          var _content = {
            title: '<strong>'+action+'</strong> task?',
            action: action.charAt(0).toUpperCase() + action.slice(1)
          };

          var _modalInstance = $modal.open({
            // template: '<h1>'+_content.title+'</h1></div><div class="feed-modal-options"><button ng-disabled="isSendingAction" ng-click="ok()">'+_content.action+'</button><button ng-click="dismiss()">Cancel</button>',
            templateUrl: 'app/presentation/feed/actionsModal/actionsModal.tpl.html',
            controller: 'CtrlFeedsAcceptModal',
            windowClass: 'feedsAcceptModal',
            scope: $scope,
            resolve: { modalAction: function() { return action; } }
          });

          _modalInstance.result.then(defer.resolve, defer.reject);
          return defer.promise;
        };

        $(el).on('click', function() {
          if ($scope.task || $scope.tasks) {
            var action = attr.actionModal || null;
            modal(action).then( function() {

            });
          }
        });
      };

      return {
        scope: false,
        link: controller
      };
    }]);

'use strict';

/* Highlight current menu element */
/* Thanks to http://stackoverflow.com/questions/12592472/how-to-highlight-a-current-menu-item-in-angularjs */
angular.module('atlasAdmin.directives.activePath')
  .directive('activePath', ['$location', 'ProfileStatus', function(location, ProfileStatus) {
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

angular.module('atlasAdmin.directives.atlasSearch')
  .directive('atlasSearch', ['$document', '$q', '$timeout', 'atlasHost', '$http', 'GroupsService', 'BBCScrubbablesService', 'ScrubbablesHelpers', '$location',
    function($document, $q, $timeout, atlasHost, $http, Groups, Scrubbables, Helpers, $location) {

      var controller = function($scope, $el) {
        $el = $($el);
        var input_timer;
        $scope.atlasSearch = {};
        $scope.atlasSearch.selectedItem = {};
        $scope.atlasSearch.showAutocomplete = false;

        $scope.atlasSearch.selectAtlasItem = function(title, id) {
          if (!_.isString(title) && !_.isString(id)) {
            return false;
          }
          $location.path('/scrubbables/'+id);
          $scope.loading = true;
          $scope.atlasSearch.searchquery = title;
          $scope.atlasSearch.showAutocomplete = false;
        };

        $scope.atlasSearch.messageOutput = function(message) {
          $scope.atlasSearch.showMessage = (typeof message === 'string') ? true : false;
          if ($scope.atlasSearch.showMessage) {
            $scope.atlasSearch.message = message;
            $scope.atlasSearch.showMessage = true;
            $scope.atlasSearch.showAutocomplete = false;
          }else{
            $scope.atlasSearch.message = '';
            $scope.atlasSearch.showMessage = false;
          }
        };

        var searchRequest = function() {
          var _query = $scope.atlasSearch.searchquery;
          if (!_query.length) {
            return;
          }

          var getContentForUri = function(uri) {
            var defer = $q.defer();
            if (!_.isString(uri)) {
              defer.reject(new Error('URI arg should be a string'));
              return defer.promise;
            }
            Scrubbables.content.uri($scope.searchKey, uri).then(function(item) {
              defer.resolve(item.contents[0]);
            });
            return defer.promise;
          };

          Scrubbables.search($scope.searchKey, _query).then(function(res) {
            var broadcasts;
            broadcasts = res.contents[0].broadcasts || null;
            if (broadcasts) {
              broadcasts = _.filter(res.contents[0].broadcasts, function(bcast) {
                if (bcast.channel.id === 'cbbh') {
                  return true;
                }
              });
              if (broadcasts.length) {
                getContentForUri(res.contents[0].uri).then(
                  function(contents) {
                    $scope.atlasSearch.searchResults.push( Helpers.formatResponse(contents) );
                    $scope.atlasSearch.messageOutput(null);
                    $scope.atlasSearch.showAutocomplete = true;
                  }, console.error);
                }else{
                  $scope.atlasSearch.messageOutput('No results found');
                  $scope.atlasSearch.showAutocomplete = false;
                }
              }else{
                $scope.atlasSearch.messageOutput('No results found');
                $scope.atlasSearch.showAutocomplete = false;
              }
            }, function(err) {
              console.error(err);
              $scope.atlasSearch.showAutocomplete = false;
            });
          };

          $scope.atlasSearch.lookupAtlasItem = function() {
            var _query = $scope.atlasSearch.searchquery;
            $scope.atlasSearch.message = null;
            $scope.atlasSearch.searchResults = [];
            if (!_.isString(_query)) {
              return;
            }
            if (!_query.length) {
              $timeout.cancel(input_timer);
              $scope.atlasSearch.search_results = null;
              $scope.atlasSearch.showAutocomplete = false;
            } else if (_query.length > 2) {
              $scope.atlasSearch.messageOutput('Searching...');
              $timeout.cancel(input_timer);
              input_timer = $timeout(searchRequest, 1000);
            }
          };
        };

        return {
          restrict: 'E',
          scope: false,
          link: controller,
          templateUrl: 'components/directives/atlasSearch/atlasSearch.tpl.html'
        };
    }]);

angular.module('atlasAdmin.directives.changeStatus')
  .directive('changestatus', ['$document', 'factoryPropositions',
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
  }]);

angular.module('atlasAdmin.directives.deleteItem')
  .directive('deleteitem', ['$document', 'factoryPropositions',
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

'use strict';

/* Focus on an element. Use "focus-me" as an attribute. */

angular.module('atlasAdmin.directives.focus')
  .directive('focusMe', function ($timeout) {
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

angular.module('atlasAdmin.directives.inputMorph')
  .directive('inputMorph', ['$document', function($document) {
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

angular.module('atlasAdmin.directives.loadContent')
  .directive('loadContent', ['$document', 'FeedsService', '$q', '$sce',
    function($document, Feeds, $q, $sce) {

    var _loaded;
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
    };

    var escapeHtml = function(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };

    var formatXml = function(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }
            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '&nbsp;&nbsp;';
            }
            formatted += '<div>' + padding + escapeHtml(node) + '</div>';
            pad += indent;
        });
        return formatted;
    };

    var controller = function($scope, element, attr) {
        _loaded = false;
        var _content;
        var $el = $(element);
        $scope.showData = false;

        // convert nitro links to bbc web links
        attr.$observe('loadContent', function() {
          _content = $scope.content_uri = attr.loadContent;
          $scope.hrefContent = $scope.content_uri.replace('http://nitro', 'http://www');
        });

        // show the result of the xml query when 'load data' button is pressed
        $('.loadData', $el).on('click', function() {
            var _this = $(this);
            _this.text('Loading data...');
            loadContent(attr.loadContent).then(function(xml) {
                var formattedXML = formatXml(xml);
                $scope.trustedXML = $sce.trustAsHtml(formattedXML);
                var codeNode = jQuery('.xml-data pre');
                setTimeout(function() {
                    hljs.highlightBlock(codeNode[0]);
                }, 100);

                $scope.showData = true;
                _this.text('Hide data');
                _this.on('click', function() {
                    if ($scope.showData) {
                        _this.text('Show data');
                    }else{
                        _this.text('Hide data');
                    }
                    $scope.showData = !$scope.showData;
                });
            });

        });
    };

    return {
        template: '<header><h2><a href="{{hrefContent}}" target="_blank">{{hrefContent}}</a></h2><span class="button small loadData">Show data</span></header><div ng-show="showData" class="xml-data"><pre ng-bind-html="trustedXML">{{trustedXML}}</pre></div>',
        link: controller
    };
}]);

'use strict';

angular.module('atlasAdmin.directives.orderable')
  .directive('orderable', function () {
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
angular.module('atlasAdmin.directives.preloader')
  .directive('preloader', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      template: '<div class="loading-container loading" ng-cloak><span class="page-loader">Loading...</span></div>',
      link: function($scope, $el, attr) {
        $scope.$on('loading-started', function(ev) {
          $el.css({'display': 'block'});
        });
        $scope.$on('loading-complete', function(ev) {
          $el.css({'display': 'none'});
        });
      }
    }
  }]);

angular.module('atlasAdmin.directives.reduxVideo')
  .directive('reduxVideo', ['$document', 'GroupsService', '$q', '$http', 'bbcRedux',
    function($document, Groups, $q, $http, bbcRedux) {

    var getEpisode = function(crid) {
    }

    var controller = function($scope, $el, $attr) {
      bbcRedux.getToken().then(function(res) {
        console.log(res);
      });
    }

    return {
      template: '<div class="scrubbables-video"></div>',
      link: controller,
      scope: false
    }
  }]);

angular.module('atlasAdmin.directives.scrubber')
  .directive('scrubber', ['$document', '$compile',
    function($document, $compile) {

    var controller = function($scope, $el, $attr) {
        // Scrubber and timeline elements
        var EL = $($el);
        var TIMELINE = $('.scrubber-timeline', EL);
        var CREATED = $('.scrubber-created-segments', EL);

        // State variables
        var MOUSEDOWN = false;
        var IS_DRAGGING = false;
        var IS_FOCUSED = false;
        var CONTEXT_LENGTH;
        var CURSOR_POS;
        var CURSOR_TIME;

        // Any data that the below timeline objects contain will be
        // rendered in the draw function
        //
        // Shape of a TIMELINE_SEGMENT object:
        // {
        //  _id: string
        //  startTime: number
        //  endTime: number
        // }
        var TIMELINE_SEGMENTS = [];
        var LIVE_ITEM = [];

        // Create the time marker component
        var TIME_MARKERS = templates().time_markers;
        EL.append( TIME_MARKERS );


        // Draw
        //
        // Used for drawing a 'frame'. All rendering stuff to the
        // screen should be done in the draw method
        var _new_el;
        var _last_cursor_pos = {};
        function draw() {
            // Determine the difference between a 'drag' or a 'click'
            // by figuring out how much the mouse has moved since the
            // last draw cycle
            if (MOUSEDOWN && !IS_DRAGGING) {
                if ((_last_cursor_pos.x-1 > CURSOR_POS.x) ||
                    (_last_cursor_pos.x+1 < CURSOR_POS.x)) {
                    IS_DRAGGING = true;
                }else{
                    IS_DRAGGING = false;
                }
                _last_cursor_pos = CURSOR_POS;
            }

            // When the cursor is dragging
            if (!LIVE_ITEM.length &&
                IS_DRAGGING &&
                MOUSEDOWN) {
                newTimelineItem();
            }

            // Render the new timeline item - this is the item that is
            // currently being created or edited
            if (LIVE_ITEM.length) {
                if (!$('.scrubber-timeline-item', TIMELINE).length) {
                    _new_el = templates().timeline_item;
                    TIMELINE.append(_new_el);
                    _new_el.addClass('new');
                }
                if (IS_DRAGGING) {
                    LIVE_ITEM[0].end = (CURSOR_POS.x > LIVE_ITEM[0].start) ? CURSOR_POS.x : 1;
                }
                if (!MOUSEDOWN) {
                    showEditUI(_new_el);
                }
                _new_el.css('margin-left', LIVE_ITEM[0].start+'px');
                _new_el.css('width', LIVE_ITEM[0].end - LIVE_ITEM[0].start+'px');
            }else{
                clearImpermanentItems();
            }

            // Render segments to the timeline
            updateTimelineSegments();

            // Update the scrub time and position of marker elements when the cursor moves over the timeline
            updateCursorTime();
            if (CURSOR_TIME) {
                $('.scrubber-time-cursor .scrubber-time-label', TIME_MARKERS).text(CURSOR_TIME.hh+':'+CURSOR_TIME.mm+':'+CURSOR_TIME.ss);
                $('.scrubber-time-cursor', TIME_MARKERS).css('left', (CURSOR_TIME.width_ratio*100)+'%');
            }

            requestAnimationFrame(draw);
        }


        // Update timeline segments
        //
        //
        function updateTimelineSegments() {
            var i, _item, _el, _segment_id;
            for (i in TIMELINE_SEGMENTS) {
                _item = TIMELINE_SEGMENTS[i];
                _segment_id = _item._id;
                if (_item) {
                    _el = $('[data-segment-id='+_segment_id+']', CREATED);
                    // If the element isn't in the dom, inject it
                    if (!_el.length) {
                        _el = templates().timeline_item;
                        _el.addClass('scrubber-on-timeline', _segment_id);
                        _el.attr('data-segment-id', _segment_id);
                        _el.css('margin-left', secondsToPixels(_item.startTime) +'px');
                        _el.css('width', secondsToPixels(_item.endTime) - secondsToPixels(_item.startTime) +'px');
                        _el.append('<h3>'+ _item.label +'</h3><p><a href="'+ _item.url +'" target="_blank">'+ _item.url +'</a></p>');
                        _el.append('<span class="delete-segment" ng-click="scrubber.removeItem(\''+ _segment_id +'\')">x</span>');
                        CREATED.append(_el);
                        $compile($(_el))($scope);
                    }
                }
            }
        }


        // Pixels -> seconds
        //
        // Turns a pixel x value into seconds relative to the timeline
        //
        // @param pixels {number | string}
        // @returns seconds {number}
        function pixelsToSeconds(pixels) {
            if (typeof pixels !== 'number' &&
                typeof pixels !== 'string') {
                return null;
            }
            var _pixels = parseInt(pixels, 10) || 0;
            var _length = CONTEXT_LENGTH;
            var _timeline_width = TIMELINE.outerWidth();
            var _width_ratio = ((_pixels / _timeline_width) > 1) ? 1 : (_pixels / _timeline_width);
            return Math.round(_length * _width_ratio);
        }


        // Seconds -> pixels
        //
        // Turns a seconds value pixels relative to the
        // x-axis of the timeline
        //
        // @param seconds {number | string}
        // @returns pixels {number}
        function secondsToPixels(seconds) {
            if (typeof seconds !== 'number' &&
                typeof seconds !== 'string') {
                return null;
            }
            var _seconds = parseInt(seconds, 10) || 0;
            var _length = CONTEXT_LENGTH;
            var _timeline_width = TIMELINE.outerWidth();
            var _position = (_seconds / _length) * _timeline_width;
            return Math.round(_position);
        }


        // For generating a unique id
        //
        // @returns id {string}
        function generateID() {
            return Math.random().toString(36).substr(2, 9);
        }


        //  Clear impermanent items
        //
        // Clear the timeline of everything except items
        // represented in TIMELINE_SEGMENTS
        function clearImpermanentItems() {
          $('.scrubber-timeline-item.new', TIMELINE).remove();
          $('.scrubber-edit-dialog', TIMELINE).remove();
        }


        // New timeline item
        //
        // For pushing a new timeline item into the LIVE_ITEM array
        // starting at the current cursor position
        function newTimelineItem() {
          var _item = {
            start: CURSOR_POS.x
          };
          LIVE_ITEM.push(_item);
        }


        // Remove timeline segment
        //
        // Clear an item from the timeline segments array
        //
        // @param id {string} the _id of the item
        function removeSegment(id) {
            if (!TIMELINE_SEGMENTS.length || !_.isString(id)) {
              return false;
            }
            // Splice from the TIMELINE_SEGMENTS array
            for (var i in TIMELINE_SEGMENTS) {
              if (TIMELINE_SEGMENTS[i]._id === id) {
                console.log(TIMELINE_SEGMENTS[i]);
                TIMELINE_SEGMENTS.splice(i, 1);
                break;
              }
            }
            // Remove from the DOM
            var _el = $('[data-segment-id='+ id +']', CREATED);
            if (_el.length) {
              $(_el).remove();
            }
        }


        function createSegmentObj(label, url, startTime, duration, id) {
          return {
            label: label,
            url: url,
            startTime: startTime,
            endTime: startTime + duration,
            _id: id
          };
        }


        // Add segment
        //
        // Pushes a new segment into the global TIMELINE_SEGMENTS array
        // based on passed properties
        //
        // @param new_segment {Object} the options for the new segment
        function addSegment() {
            $scope.scrubber.submitted = true;
            _create = $scope.scrubber.create;
            if (scrubberForm.linkLabel.value === '' ||
                scrubberForm.linkUrl.value === '' ||
                !LIVE_ITEM.length) {
                return false;
            }
            var startTime = (pixelsToSeconds(LIVE_ITEM[0].start) < 0) ? 0 : pixelsToSeconds(LIVE_ITEM[0].start);
            var endTime = (pixelsToSeconds(LIVE_ITEM[0].end) <= startTime) ? startTime+1 : pixelsToSeconds(LIVE_ITEM[0].end);
            var _segment = createSegmentObj($scope.scrubber.create.label,
                            $scope.scrubber.create.url,
                            startTime,
                            endTime - startTime,
                            generateID());
            if (_segment.label && _segment.url) {
                $scope.scrubber.clearTempSegment();
                TIMELINE_SEGMENTS.push(_segment);
            }else{
                console.error('Couldnt make new segment with data', _segment);
            }
            $scope.scrubber.segments = TIMELINE_SEGMENTS;
            $scope.scrubber.submitted = false;
        }

        // Get cursor position
        //
        // For getting the current cursor position relative to the
        // TIMELINE dom element, and writing it to CURSOR_POS variable
        function getCursorPosition() {
            CURSOR_POS = CURSOR_POS || {x:0, y:0};
            var _el_offset = TIMELINE.offset();
            EL.on('mousemove', function (e) {
                var x = (e.pageX - _el_offset.left);
                var y = (e.pageY - _el_offset.top);
                CURSOR_POS = { x: x, y: y };
            });
        }


        // Update cursor time
        //
        // For calculating time and updating the CURSOR_TIME variable
        function updateCursorTime() {
            var _seconds = pixelsToSeconds(CURSOR_POS.x);
            var _time = secondsToHHMMSS(_seconds);
            var _timeline_width = TIMELINE.outerWidth();
            if (_time) {
                CURSOR_TIME = _time;
                CURSOR_TIME.width_ratio = CURSOR_POS.x / _timeline_width;
            }
        }


        // Get context length
        //
        // Used for getting the context length in seconds from the
        // data-scrubber-length attribute
        function getContextLength() {
            CONTEXT_LENGTH = parseInt($attr.scrubberLength, 10);
        }


        // Show edit UI
        //
        // Bring up the edit dialog box
        //
        // @param element {DOMObject} the timeline element to append to
        function showEditUI (element) {
            if (!$('.scrubber-edit-dialog', TIMELINE).length) {
                var edit_ui = templates().edit_bubble;
                $(element).append(edit_ui);
                $compile($(edit_ui))($scope);
            }
        }


        // Seconds -> HHMMSS
        //
        // Converts boring old seconds to object containing
        // HH MM SS as strings
        //
        // @returns {Object} of {Number}s. keys: hh, mm, ss
        function secondsToHHMMSS (secs) {
            if (typeof secs !== 'number' &&
                typeof secs !== 'string') {
                return null;
            }
            var _seconds = parseInt(secs, 10);
            var hours = (Math.floor(_seconds/3600) < 0) ? 0 : Math.floor(_seconds/3600);
            var minutes = Math.floor((_seconds - (hours*3600)) / 60);
            var seconds = _seconds - (hours * 3600) - (minutes * 60);
            return {
                hh: (hours < 10) ? '0'+hours : hours.toString(),
                mm: (minutes < 10) ? '0'+minutes : minutes.toString(),
                ss: (seconds < 10) ? '0'+seconds : seconds.toString()
            };
        }


        // Set time markers
        //
        // Populate the times markers based on the CONTEXT_LENGTH variable
        function setTimeMarkers() {
            var _running_time = secondsToHHMMSS(CONTEXT_LENGTH);
            if (_running_time) {
                var el_start = $('.scrubber-time-start .scrubber-time-label', TIME_MARKERS);
                var el_end = $('.scrubber-time-end .scrubber-time-label', TIME_MARKERS);
                el_start.text('00:00:00');
                el_end.text(_running_time.hh+':'+_running_time.mm+':'+_running_time.ss);
            }
        }


        // Templates povider
        //
        // A provider that returns jQuery elements for use as templates.
        // See return value for available templates
        //
        // @returns {Object}
        function templates() {
            var timeline_item = function() {
                return $('<div class="scrubber-timeline-item"></div>');
            };

            var edit_bubble = function() {
                var lines = [];
                lines.push('<div class="scrubber-edit-dialog"><form novalidate name="scrubberForm">');
                lines.push('<h2>New segment</h2>');
                lines.push('<div class="scrubber-form-row">');
                //lines.push('<span class="segment-form-error" ng-show="scrubber.submitted && scrubberForm.linkLabel.$invalid">This link needs a label</span>');
                lines.push('<input type="text" name="linkLabel" ng-model="scrubber.create.label" placeholder="label">');
                lines.push('</div>');
                lines.push('<div class="scrubber-form-row">');
                //lines.push('<span class="segment-form-error" ng-show="scrubber.submitted && scrubberForm.linkUrl.$invalid">This url needs a valid url</span>');
                lines.push('<input type="url" name="linkUrl" ng-model="scrubber.create.url" placeholder="http://">');
                lines.push('</div>');
                lines.push('<div class="scrubber-button-group"><button class="cancel" ng-click="scrubber.clearTempSegment()">Cancel</button><button class="create" ng-click="scrubber.createLink()">Create link</button></div>');
                lines.push('</form></div>');
                return $(lines.join(''));
            };

            var time_markers = function() {
                var lines = [];
                lines.push('<div class="scrubber-times-container">');
                lines.push('<div class="scrubber-time-start"><span class="scrubber-time-label"></span></div>');
                lines.push('<div class="scrubber-time-cursor hide"><span class="scrubber-time-label"></span></div>');
                lines.push('<div class="scrubber-time-end"><span class="scrubber-time-label"></span></div>');
                lines.push('</div>');
                return $(lines.join(''));
            };

            return {
                timeline_item: timeline_item(),
                edit_bubble: edit_bubble(),
                time_markers: time_markers()
            };
        }


        // Bootstrap
        //
        // Initialise all the things, and attach global events, and start
        // the draw process
        function bootstrap() {
            getCursorPosition();
            $scope.scrubber = {};
            $scope.scrubber.create = {};
            $scope.scrubber.segments = [];
            $scope.scrubber.submitted = false;
            $scope.scrubber.createLink = addSegment;
            $scope.scrubber.removeItem = removeSegment;

            $scope.scrubber.clearTempSegment = function() {
              LIVE_ITEM = [];
              $scope.scrubber.create = {};
              return;
            };

            $scope.scrubber.loadSegments = function(events) {
              if (! _.isArray(events)) {
                console.warn('events expected to be an array');
                return;
              }

              var _segment, offset;
              _.forEach(events, function (ev) {
                offset = ev.offset || 0;
                if (ev.segment.related_links) {
                  _.forEach(ev.segment.related_links,
                  function (link) {
                    _segment = createSegmentObj(link.title,
                                                link.url,
                                                offset,
                                                ev.segment.duration,
                                                $scope.generateID());
                    TIMELINE_SEGMENTS.push(_segment);
                  });
                }
              });
            };

            $attr.$observe('scrubberLength', function() {
                getContextLength();
                setTimeMarkers();
            });

            EL
            .on('mouseenter', function () {
                IS_FOCUSED = true;
            })
            .on('mouseleave', function() {
                IS_FOCUSED = false;
            });

            TIMELINE
            .on('mousedown', function (e) {
                if ($(e.target).is('.scrubber-timeline, .scrubber-timeline-item')) {
                    MOUSEDOWN = true;
                }else{
                    MOUSEDOWN = false;
                }
            })
            .on('mouseup', function () {
                if (IS_DRAGGING) {
                    IS_DRAGGING = false;
                }
                MOUSEDOWN = false;
            });
            $scope.scrubber.segments = TIMELINE_SEGMENTS;
            requestAnimationFrame(draw);
        }
        bootstrap();
    };


    return {
        template: '<div class="scrubber-created-segments"></div><div class="scrubber-timeline"></div>',
        link: controller
    };
}]);

angular.module('atlasAdmin.directives.showSegments')
  .directive('showSegments', ['$document', '$q', '$timeout', 'atlasHost', '$http',
    function($document, $q, $timeout, atlasHost, $http) {

    // For creating a new segment block to be pushed into the
    // showSegments.segments array
    var createSegmentObj = function(label, url, startTime, duration, id) {
      return {
        label: label,
        url: url,
        startTime: startTime,
        endTime: startTime + duration,
        _id: id
      };
    };


    var controller = function($scope, $el, $attr) {
      var $el = $($el);
      $scope.showSegments = {};
      $scope.showSegments.newItem = {};
      $scope.showSegments.segments = [];
      $scope.showSegments.showCreateUI = false;
      $scope.showSegments.submitted = false;

      $scope.showSegments.loadSegments = function(events) {
        if (! _.isArray(events)) {
          console.error('events expected to be an array');
          return;
        }
        var _segment, _duration;
        _.forEach(events, function (ev) {
          if ( _.has(ev.segment, 'related_links') ) {
            _.forEach(ev.segment.related_links,
            function (link) {
              _duration = ev.segment.duration || 0;
              _segment = createSegmentObj(link.title,
                                          link.url,
                                          0,
                                          _duration,
                                          $scope.generateID());
              $scope.showSegments.segments.push(_segment);
            });
          }
        });
      };

      $scope.showSegments.removeItem = function(id) {
          if (!_.isString(id)) {
            return false;
          }

          for (var i in $scope.showSegments.segments) {
              if ($scope.showSegments.segments[i]._id === id) {
                  console.log(id);
                  $scope.showSegments.segments.splice(i, 1);
                  break;
              }
          }
      };

      $scope.showSegments.createUI = function() {
          $scope.showSegments.showCreateUI = true;
          $scope.showSegments.newItem = {};
      };

      $scope.showSegments.cancel = function() {
          $scope.showSegments.showCreateUI = false;
          $scope.showSegments.newItem = {};
      };

      $scope.showSegments.new = function() {
          $scope.showSegments.submitted = true;
          if (newSegmentForm.linkLabel.value === '' || newSegmentForm.linkUrl.value === '' ) {
            return;
          }

          var _segment = createSegmentObj($scope.showSegments.newItem.label,
                                          $scope.showSegments.newItem.url,
                                          0,
                                          $scope.broadcast.duration,
                                          $scope.generateID());
          $scope.showSegments.segments.push(_segment);
          $scope.showSegments.newItem.label = $scope.showSegments.newItem.url = '';
          $scope.showSegments.showCreateUI = false;
          $scope.showSegments.submitted = false;
      };
    };

    return {
        restrict: 'E',
        scope: false,
        link: controller,
        templateUrl: 'components/directives/showSegments.tpl.html'
    };
  }]);

'use strict';

angular.module('atlasAdmin.directives.validUsage')
  .directive('validUsage', function () {
    return {
      require: 'ngModel',
      link: function(scope, ele, attrs, c) {
        scope.$watch(attrs.ngModel, function() {
          c.$setValidity('validUsage', ele[0].value != "0");
        });
      }
    }
});

'use strict';

angular.module('atlasAdmin.interceptors.auth')
  .factory('AuthenticationInterceptor', ['$q', '$location', 'atlasHost', 'atlasApiHost', '$window', 'Authentication',
    function($q, $location, atlasHost, atlasApiHost, $window, Auth) {
    return {
        'request': function(config) {
            var _url = config.url;
            if (_url.indexOf('partials') !== -1 ||
                _url.indexOf('/login') !== -1 ||
                _url.indexOf('/logout') !== -1 ||
                _url.indexOf('/auth/') !== -1) {
                return config || $q.defer(config);
            }
            var _provider = Auth.getProvider() || null;
            var _token = Auth.getToken() || null;
            if (!_token || !_provider) {
                console.log('Token and provider aren\'t present in localstorage');
                $location.path('/login');
            }
            return config || $q.defer(config);
        },

        'responseError': function(response) {
            var _url = _.has(response.config, 'url') ? response.config.url : null;
            if (! _url) {
              console.warn('Cannot find url property in response', response.config);
              return;
            }
            if (_url.indexOf(atlasHost) !== -1 || _url.indexOf(atlasApiHost) !== -1) {
                if (response.status === 400) {
                    console.error('Account not authenticated to make request to: '+_url);
                }else if (response.status === 403) {
                    console.error('You do not have access to the resource ' + _url);
                }
            }
            return response || $q.defer(response);
        }
    };
}]);

'use strict';

angular.module('atlasAdmin.interceptors.loading')
  .factory('LoadingInterceptor', ['$q', '$rootScope', '$injector', '$timeout', '$location',
        function($q, $rootScope, $injector, $timeout, $location) {
        var requests = 0;
        var loadTimer;
        var restrictedLocations = ['scrubbables'];

        if (!$rootScope.show) {
            $rootScope.show = {};
        }

        var restricted = function() {
            var _path = $location.path();
            for (var i in restrictedLocations) {
                if (_path.indexOf(restrictedLocations[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }

        var startLoading = function() {
            var _loggedin = $rootScope.status.loggedIn || false;
            if (requests > 1 && _loggedin && !restricted()) {
                $timeout.cancel(loadTimer);
                $rootScope.show.cloak = true;
                loadTimer = $timeout(function() {
                    $rootScope.show.load = true;
                    $rootScope.$broadcast('loading-started');
                }, 400);
            }
        }

        var endLoading = function() {
            $timeout.cancel(loadTimer);
            $rootScope.$broadcast('loading-complete');
            $rootScope.show.load = false;
            $rootScope.show.cloak = false;
        }

        // precautionary incase the loading process is
        // still running from the last page
        endLoading();
        $rootScope.show.cloak = true;

        return {
            'request': function(config) {
                requests++;
                startLoading();
                return config || $q.when(config);
            },
            'response': function(response) {
                requests = (requests > 0)? --requests : 0;
                if (!requests) endLoading();
                return response || $q.when(response);
            }
        };
    }]);

'use strict';

angular.module('atlasAdmin.interceptors.profileComplete')
  .factory('ProfileCompleteInterceptor', ['ProfileStatus', '$location', '$q', '$rootScope', 'Authentication',
    function (ProfileStatus, $location, $q, $rootScope, Auth) {
    return {
        'request': function(config) {
            var _url = config.url;
            var _provider = Auth.getProvider() || null;
            var _token = Auth.getToken() || null;

            // some paths are just for use by the application; we don't want
            // those to be included in redirects etc
            var allowedRoute = function () {
                return (_url.indexOf('/auth') === -1 &&
                        _url.indexOf('/logout') === -1 &&
                        _url.indexOf('/login') === -1 &&
                        _url.indexOf('/profile') === -1);
            }

            if (_provider && _token) {
                if (!ProfileStatus.isProfileComplete() &&
                    allowedRoute()) {
                        $location.path('/profile');
                }
                if (ProfileStatus.getLicenseAccepted() === false &&
                    allowedRoute()) {
                    $location.path('/terms');
                }
            }
            return config || $q.reject(config);
        },
        'response': function(response) {
            return response || $q.reject(response);
        }
    }
}]);

'use strict';

angular.module('atlasAdmin.services.applications')
  .factory('Applications', function (Atlas) {
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
            return Atlas.postRequest('/applications.json', application).then(function (results) {
                return results.data.application;
            });
        }
    };
 });

'use strict';

angular.module('atlasAdmin.services.apiUsage')
  .factory('APIUsage', ['$http', 'Authentication', 'atlasApiHost', '$q',
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
angular.module('atlasAdmin.services.atlas')
  .factory('Atlas', function ($http, atlasHost, atlasVersion, Authentication, $log) {
    return {
        getRequest: function(url) {
            var usersUrl = Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion +  url);
            console.log('get-> ' + usersUrl);
            return $http.get(usersUrl);
        },
        getUrl: function (url) {
            return Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url);
        },
        postRequest: function(url, data) {
            return $http.post(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url), data, {withCredentials: false});
        },
        deleteRequest: function(url) {
            return $http.delete(Authentication.appendTokenToUrl(atlasHost + "/" + atlasVersion + url));
        },
        getAuthProviders: function() {
            return $http.get(atlasHost + "/" + atlasVersion + "/auth/providers.json").then(function(results){
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
angular.module('atlasAdmin.services.auth')
  .factory('Authentication', ['$rootScope', 'ProfileStatus',
      function ($rootScope, ProfileStatus) {
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
              localStorage.removeItem('profile.complete');
              localStorage.removeItem('license.accepted');
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
              return (url.indexOf('?') === -1) ?
                          url + '?' + oauthParams :
                          url + '&' + oauthParams;
          }
      };
  }]);

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

'use strict';
angular.module('atlasAdmin.services.feeds')
  .factory('FeedsService', ['$http', 'Authentication', 'atlasApiHost', '$q',
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
            defer.resolve(data);
          }else{
            defer.reject();
          }
        })
        .error(function(data, status) {
          defer.reject(status);
        });
        return defer.promise;
      };


      //  Used for making a request
      //
      //  @param feed_uri {string}
      //  @param method {string}
      //  @param params {object}
      //  @returns promise<$httpResponse>
      //
      var request = function(feed_uri, method, params) {
        method = method || 'get';
        params = params || null;
        var defer = $q.defer();
        var request;

        if (! _.isString(feed_uri)) {
          defer.reject('Feed uri must be included as first argument');
          return defer.promise;
        }

        request = {
          method: method,
          url: Authentication.appendTokenToUrl(atlasApiHost + '/feeds/' + feed_uri),
          dataType: 'json'
        };

        if (_.isObject(params)) {
          request.data = params;
        }

        $http(request).success(defer.resolve).error(defer.reject);

        return defer.promise;
      };


      //  Used for running actions on tasks
      //
      //  @param action {string}
      //  @param tasks {object}
      //  @param selection {array}
      //
      var doAction = function(action, pid) {
        var defer = $q.defer();
        var _postdata = { uri: 'http://nitro.bbc.co.uk/programmes/' + pid };

        if (! _.isString(action) || ! _.isString(action) ) {
          defer.reject(new Error('`action` and `pid` should be a string'));
        }

        request('youview/bbc_nitro/action/' + action + '/' + pid, 'post', _postdata).then(
        function() {
          defer.resolve();
        });

        return defer.promise;
      };

      return {
        action: doAction,
        get: getFeeds,
        request: request
      };
    }]);

'use strict';
angular.module('atlasAdmin.services.users')
  .factory('GroupsService', ['$http', 'Authentication', 'atlasApiHost', '$q',
    function($http, Authentication, atlasApiHost, $q) {

      //  Used for getting an array of available groups for this user
      //
      //  @returns promise
      //
      var getGroups = function() {
        var defer = $q.defer();
        $http({
          method: 'get',
          url: Authentication.appendTokenToUrl(atlasApiHost+'/user/groups')
        })
        .success(function(data, status) {
          if (status === 200) {
            defer.resolve(data)
          }else{
            defer.reject(new Error('Groups endpoint responded with status: ' + status));
          }
        })
        .error(function(data, status) {
          defer.reject(status);
        });
        return defer.promise;
      }

      return {
        get: getGroups
      }
    }]);

'use strict';

angular.module('atlasAdmin.services.payments')
  .factory('Payments', function() {
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

angular.module('atlasAdmin.services.profileStatus')
  .factory('ProfileStatus', function() {
    return {
        getLicenseAccepted: function () {
            if (localStorage.getItem("license.accepted")) {
                return localStorage.getItem("license.accepted") == "true";
            } else {
                return null;
            }
        },

        setLicenseAccepted: function (status) {
            return localStorage.setItem("license.accepted", status ? "true" : "false");
        },

        setComplete: function(status) {
            localStorage.setItem("profile.complete", status ? "true" : "false");
        },

        isProfileComplete: function() {
            return localStorage.getItem("profile.complete") == "true";
        }
    };
  });

'use strict';

angular.module('atlasAdmin.services.propositions')
  .factory('factoryPropositions', ['$http', 'Authentication', 'atlasApiHost', '$q',
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

angular.module('atlasAdmin.services.scrubbableHelpers')
  .factory('ScrubbablesHelpers', ['$q',
    function($q) {

    // Seconds -> HHMMSS
    //
    // Converts boring old seconds to object containing
    // HH MM SS as strings
    //
    // @return {Object} keys: hh, mm, ss
    function secondsToHHMMSS(secs) {
        if (typeof secs !== 'number' &&
            typeof secs !== 'string') {
            return null;
        }
        var _seconds = parseInt(secs, 10);
        var hours = Math.floor(_seconds/3600);
        var minutes = Math.floor((_seconds - (hours*3600)) / 60);
        var seconds = _seconds - (hours * 3600) - (minutes * 60);
        return {
            hh: (hours < 10) ? '0' + hours : hours.toString(),
            mm: (minutes < 10) ? '0' + minutes : minutes.toString(),
            ss: (seconds < 10) ? '0' + seconds : seconds.toString()
        };
    }


    // Channel filter
    //
    // Used for filtering atlas search results to only have items broadcast
    // on certain channels
    //
    // @param items {array} atlas search result array
    // @param channel_id {string}
    // @return {array}
    var channelFilter = function(items, channel_id) {
        if (!_.isObject(items) || !_.isString(channel_id)) {
            console.error('channelFilter() -> wrong type');
            return null;
        }
        console.log(channel_id);
        channel_id = channel_id.toLowerCase();
        for (var i=0; items.length > i; i++) {
          var _result = _.filter(items[i].broadcasts, function(itm) {
            return (itm.channel.id === channel_id) ? true : false;
          });
          if (_result.length) {
            items[i].broadcasts = _result;
          }else{
            items[i] = null;
          }
        }
        return _.compact(items);
    };


    // Transmission time to formatted date
    //
    // @param time {string}
    var transmissionTimeToDate = function(time) {
        var _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var _date = time.split('T')[0];
        _date = new Date(_date.split('-')[0] + '/' +_date.split('-')[1] + '/' + _date.split('-')[2]);
        return {
            month: _months[_date.getMonth()],
            day: _date.getDate(),
            year: _date.getFullYear()
        };
    };


    // Format Atlas response
    //
    // @param item {object}
    // @returns {
    //  broadcast: {Object | null}.
    //  uri: {String},
    //  id: {String},
    //  title: {String},
    //  subtitle: {String},
    //  episode_number: {Number},
    //  duration: {Number},
    //  broadcast_date: {Object} { day:{String}, month:{String}, year:{String} }
    // }
    var formatAtlasResponse = function(item) {
        if (!_.isObject(item)) {
          return;
        }

        var _out = {};
        var broadcast = item.broadcasts[0] || null;
        var container = item.container || null;
        _out.broadcast = broadcast;
        _out.uri = item.uri;
        _out.id = item.id;
        _out.title = item.title;
        if (_.isObject(container)) {
            _out.title = (container.type === 'series' || container.type === 'brand')? container.title : item.title;
            if ((container.type === 'brand' || container.type === 'series') && !item.special) {
                _out.title = container.title;
                _out.subtitle = item.title;
                _out.episode_number = item.episode_number;
                _out.duration = secondsToHHMMSS(broadcast.duration);
            }
        }
        if (_.isObject(broadcast)) {
            _out.broadcast_date = transmissionTimeToDate(broadcast.transmission_time);
        }
        return _out;
    };


    return {
        formatResponse: formatAtlasResponse,
        channelFilter: channelFilter
    };
  }]);

angular.module('atlasAdmin.services.sourceLicenses')
  .factory('SourceLicenses', function (Atlas, Users) {
      return {
          get: function(sourceId) {
            return Atlas.getRequest('/source_licenses/' + sourceId + '.json').then(
            function (results) {
              return results.data.source_license
            });
          }
      }
  });

angular.module('atlasAdmin.services.scrubbables')
  .factory('BBCScrubbablesService', ['atlasHost', '$http', '$q', 'GroupsService',
    function(atlasHost, $http, $q, Groups) {

    var SCRUBBABLES_HOST = atlasHost.indexOf('stage') > -1 ? '//scrubbables-stage.metabroadcast.com' : '//scrubbables.metabroadcast.com';
    var owlAnnotations = 'annotations=description,extended_description,next_broadcasts,broadcasts,brand_summary,series_summary,upcoming,locations,available_locations';
    var deerAnnotations = 'annotations=segment_events,description,extended_description,series_summary,description';

    var getKeys = function() {
        var defer = $q.defer();
        Groups.get().then(function(res) {
            for (var i=0; i<res.length; i++) {
                if (res[i].name === 'BBC-Scrubbables') {
                    defer.resolve({
                        owlRead: res[i].data.searchApiKey,
                        owlWrite: res[i].data.writeApiKey,
                        deerRead: res[i].data.scrubbableApiKey
                    });
                }
            }
        }, defer.reject);
        return defer.promise;
    };

    var searchContent = function(apiKey, query) {
        var defer = $q.defer();
        var searchAnnotations = 'description,extended_description,next_broadcasts,brand_summary,channel_summary,series_summary,upcoming,related_links';
        $http.get(atlasHost + '/3.0/search.json?apiKey='+encodeURIComponent(apiKey)+'&q='+encodeURIComponent(query)+'&limit=10&type=item&annotations=' + searchAnnotations + '&topLevelOnly=false&specialization=tv,film&currentBroadcastsOnly=true')
             .success(function(data, status) {
                if (status >= 300) {
                    defer.reject('Atlas search returned an error. Status: '+status);
                    return;
                }
                defer.resolve(data);
             })
             .error(defer.reject);
        return defer.promise;
    };

    var getDeerContentURI = function(apiKey, id) {
        var defer = $q.defer();
        $http.get(atlasHost + '/4/content/' + id + '.json?key=' + encodeURIComponent(apiKey) + '&' + deerAnnotations)
             .success(function(data, status) {
                if (status !== 200) {
                    defer.reject('Atlas deer content request returned an error. Status:'+status);
                }else{
                    defer.resolve(data);
                }
             })
             .error(defer.reject);

        return defer.promise;
    };

    var getContentURI = function(apiKey, uri) {
        var defer = $q.defer();
        if (!_.isString(uri)) {
          defer.reject('uri is not a string');
          return defer.promise;
        }
        $http.get(atlasHost + '/3.0/content.json?apiKey='+encodeURIComponent(apiKey)+'&uri=' + encodeURIComponent(uri) + '&' + owlAnnotations)
            .success(function(data, status) {
                if (status !== 200) {
                    defer.reject('Atlas content request returned an error. Status:'+status);
                }else{
                    defer.resolve(data);
                }
            })
            .error(defer.reject);
        return defer.promise;
    };

    var getContentID = function(apiKey, id) {
        var defer = $q.defer();
        if (!_.isString(id)) {
          return null;
        }

        $http.get(atlasHost + '/3.0/content.json?apiKey='+encodeURIComponent(apiKey)+'&id=' + encodeURIComponent(id) + '&' + owlAnnotations).success(
        function(data, status) {
          if (status !== 200) {
            defer.reject('Atlas content request returned an error. Status:'+status);
          }else{
              defer.resolve(data);
          }
        })
          .error(defer.reject);
        return defer.promise;
    };

    // Create content block
    //
    // @param segments {array}
    // @param uri {string}
    // @param id {string}
    var createContentBlock = function(segments, uri, id) {
        var _template = {
            'segment_events': [],
            'same_as': [uri],
            'equivalents':[{'uri': uri, 'id': id}],
            'publisher': {
                'country': 'GB',
                'key': 'scrubbables-producer.bbc.co.uk',
                'name': 'BBC Scrubbables Producer'
            },
            'type': 'item',
            'uri':'http://scrubbables-frontend.metabroadcast.com/' + id
        };

        console.log(segments);
        if (typeof segments === 'object') {
            for (var i in segments) {
                var _segment = segments[i];
                var _event = {
                    'position': 0,
                    'offset': _segment.offset,
                    'segment': {
                        'duration': _segment.duration,
                        'segment_type': 'VIDEO',
                        'related_links':[
                            {
                                'type':'article',
                                'url':_segment.url,
                                'title':_segment.title,
                                'shortName':_segment.title,
                                'description': _segment.title,
                                'sourceId':'Source'
                            }
                        ]
                    }
                };
                _template.segment_events.push(_event);
            }
        }
        return _template;
    };


    // Post to owl
    //
    // @param apiKey {string}
    // @param data {object}
    var postToOwl = function (apiKey, data) {
      var defer = $q.defer();
      var _data = data || {};
      if (! _.isString(apiKey) ||
          ! _.isObject(_data.segments) ||
          ! _.isObject(_data.atlas)) {
          defer.reject(new Error('postToOwl() -> incorrect param'));
          return defer.promise;
      }
      var _postdata = createContentBlock( _data.segments,
                                          _data.atlas.uri,
                                          _data.atlas.id);

      var postRequest = $http({
        method: 'post',
        url: atlasHost + '/3.0/content.json?apiKey=' + apiKey,
        data: _postdata
      });

      postRequest.success(function (res, status, header) {
        var location = header('Location');
        if (! _.isString(location)) {
          console.warn('content id could not be grabbed from location');
          defer.reject();
        }
        var indexOfId = location.indexOf("id=");
        var contentId = location.substr(indexOfId + 3);
        defer.resolve(contentId);
      });
      return defer.promise;
    };


    var triggerMigration = function (id) {
      var defer = $q.defer();
      var migrationUri = SCRUBBABLES_HOST + '/1/scrubbables/' + id + '/migrate';
      if (! _.isString(id)) {
        defer.reject( new Error('id param must be a string') );
        return defer.promise;
      }
      $http.post(migrationUri).then(
      function (res) {
        console.log(res);
      });
      return defer.promise;
    };


    return {
        keys: getKeys,
        create: postToOwl,
        search: searchContent,
        migrateContent: triggerMigration,
        content: {
            uri: getContentURI,
            id: getContentID,
        },
        deerContent: getDeerContentURI
    };
  }]);

'use strict';

angular.module('atlasAdmin.services.sourceRequests')
  .factory('sourceRequests', ['$http', 'Authentication', 'atlasApiHost', 'Atlas', 'Users', '$q',
    function ($http, Authentication, atlasApiHost, Atlas, Users, $q) {
      var endpoint = atlasApiHost + '/requests';

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
          },
          postRequest: function(data) {
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
          },
          getUnapprovedRequests: function() {
              var defer = $q.defer();
              $http({
                  method: 'get',
                  url: Authentication.appendTokenToUrl(endpoint)
              })
              .success(function(data) {
                  defer.resolve(data)
              })
              return defer.promise;
          },
          putChangeRequest: function(data) {
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
        }
    }]);

'use strict';

angular.module('atlasAdmin.services.sources')
  .factory('Sources', function (Atlas, Applications, $log) {
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

'use strict';
angular.module('atlasAdmin.services.uservideosources')
  .factory('UserVideoSources', ['Atlas', 'atlasVersion', 'Applications',
    function (Atlas, atlasVersion, Applications) {
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
    }]);

angular.module('atlasAdmin.services.users')
  .factory('Users', ['$http', 'Atlas', '$rootScope', 'Authentication', 'ProfileStatus', '$log', 'atlasApiHost', '$q',
      function($http, Atlas, $rootScope, Authentication, ProfileStatus, $log, atlasApiHost, $q) {
      return {
          currentUser: function(callback) {
              $.ajax({
                  url: Atlas.getUrl('/auth/user.json'),
                  success: function (result) {
                      if (result.user) {
                          if (result.user.profile_complete) {
                              ProfileStatus.setComplete(result.user.profile_complete);
                          }
                          if (typeof result.user.license_accepted === 'string') {
                              ProfileStatus.setLicenseAccepted(true);
                          }else{
                              ProfileStatus.setLicenseAccepted(false);
                          }
                          callback(result.user);
                      }
                  },
                  error: function () {
                      $log.error("No user");
                      return null;
                  }
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
  }])

  .factory('ProfileStatus', function() {
    return {
        getLicenseAccepted: function () {
            if (localStorage.getItem("license.accepted")) {
                return localStorage.getItem("license.accepted") == "true";
            } else {
                return null;
            }
        },

        setLicenseAccepted: function (status) {
            return localStorage.setItem("license.accepted", status ? "true" : "false");
        },

        setComplete: function(status) {
            localStorage.setItem("profile.complete", status ? "true" : "false");
        },

        isProfileComplete: function() {
            return localStorage.getItem("profile.complete") == "true";
        }
    };
});

'use strict';

angular.module('atlasAdmin.services.wishes')
  .factory('Wishes', ['$http', 'Authentication', 'atlasApiHost', '$q',
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

angular.module('atlasAdmin.application')
.controller('SourceRequestFormModalCtrls', ['$scope', '$modalInstance', 'Applications', 'SourceRequests', '$log',
    function($scope, $modalInstance, Applications, SourceRequests, $log) {

    $scope.item = {};
    $scope.item.invalid = true;
    $scope.app.sourceRequest.usageTypes = [
        {value: 'invalid', label: '<Please select>'},
        {value: 'commercial', label: 'Commercial'},
        {value: 'non_commercial', label: 'Non commercial'},
        {value: 'personal', label: 'Personal'}
    ];
    $scope.app.sourceRequest.reason = '';
    $scope.app.sourceRequest.applicationUrl = '';
    $scope.app.sourceRequest.usageType = 'invalid'; //default value for usage type
    $scope.app.wait = false;
    $scope.ok = function() {
        $scope.app.wait = true;
        SourceRequests.send(
            $scope.app.sourceRequest.source.id,
            $scope.app.sourceRequest.applicationId,
            $scope.app.sourceRequest.applicationUrl,
            $scope.app.sourceRequest.reason,
            $scope.app.sourceRequest.usageType,
            true
        )
        .then(function() {
            $modalInstance.close();
        },
        function(error) {
            $log.error(error);
            $modalInstance.close();
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);

'use strict';

angular.module('atlasAdmin.application')
.controller('ViewTermsCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance) {
      $scope.close = function() {
          $modalInstance.dismiss();
      };
    }]);

'use strict';

angular.module('atlasAdmin.applications')
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

angular.module('atlasAdmin.feed')
  .controller('CtrlFeedsAcceptModal', ['$scope', '$modalInstance', '$q', 'FeedsService', 'modalAction', '$http', 'atlasHost',
    function($scope, $modalInstance, $q, Feeds, modalAction, $http, atlasHost) {
        var pidLength = 8;
        $scope.actionName = modalAction;
        $scope.pidValue = '';
        $scope.showSearchRes = false;
        $scope.resultMessage = {};
        $scope.clearUI = false;
        $scope.isBusy = false;
        $scope.atlasResult = {  };
        $scope.uiStrings = {
          revoke: 'Revoke',
          upload: 'Publish'
        };

        var trimString = function (wordCount, string) {
          var append = '';
          var words = string.split(' ');

          if (words.length > wordCount) {
            append = '...';
          }
          var truncated = words.slice(0, wordCount).join(' ');
          return truncated + append;
        };

        var runRevoke = function (pid) {
          var payload = {
            uri: 'http://nitro.bbc.co.uk/programmes/' + pid
          };

          $scope.isBusy = true;

          Feeds.request('youview/bbc_nitro/action/revoke', 'post', payload).then(
          function (data, status) {
            if (_.isObject(data)) {
              $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
              $scope.isBusy = false;
              return;
            }
            $scope.showSearchRes = false;
            $scope.atlasResult = {  };
            $scope.resultMessage.body = 'The revoke transaction has been added to the queue';
            $scope.resultMessage.class = 'success';
            $scope.clearUI = true;
            $scope.isBusy = false;
          },
          function () {
            $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
            $scope.resultMessage.class = 'error';
            $scope.isBusy = false;
          });
        };

        var runIngest = function (pid) {
          var payload = {};

          $scope.isBusy = true;

          Feeds.request('forceUpdate/' + pid, 'post', payload).then(
          function (data, status) {
            if (_.isObject(data)) {
              $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
              $scope.isBusy = false;
              return;
            }
            $scope.showSearchRes = false;
            $scope.atlasResult = {  };
            $scope.resultMessage.body = 'The publish transaction has been added to the queue';
            $scope.resultMessage.class = 'success';
            $scope.clearUI = true;
            $scope.isBusy = false;
          },
          function () {
            $scope.resultMessage.body = 'The transaction could not be completed because of a server error';
            $scope.resultMessage.class = 'error';
            $scope.isBusy = false;
          });
        };

        $scope.findPid = function (pidValue) {
          if (pidValue.length !== pidLength) {
            return console.warn('PID isn\'t the correct length');
          }
          var nitroUri = 'http://nitro.bbc.co.uk/programmes/' + pidValue;
          $http.get(atlasHost + '/3.0/content.json?apiKey=cae02bc954cf40809d6d70601d3e0b88&uri=' + nitroUri + '&annotations=description,extended_description,brand_summary')
            .success( function (data, status) {
              $scope.showSearchRes = true;
              var atlasres = data.contents[0];

              if (atlasres) {
                $scope.atlasResult.imageUrl = atlasres.image;
                $scope.atlasResult.title = atlasres.title;
                $scope.atlasResult.brand = atlasres.container.title || '';
                $scope.atlasResult.time = 1;
                $scope.atlasResult.description = trimString(60, atlasres.description);
              }
            })
            .error(function (data, status) {
              $scope.resultMessage.body = 'The PID search could not be completed because of a server error';
              $scope.resultMessage.class = 'error';
            });
        };


        $scope.triggerAction = function (actionName, pid) {
          if (! pid) {
            return console.warn('cannot trigger action because there is no pid argument');
          }
          if (! actionName) {
            return console.warn('cannot trigger action because there is no actionName argument');
          }
          switch (actionName) {
            case 'upload': runIngest(pid); break;
            case 'revoke': runRevoke(pid); break;
          }
        };

        $scope.dismiss = function() {
          $modalInstance.dismiss();
        };
      }]);

angular.module('atlasAdmin.feedBreakdown')
  .controller('CtrlStatusDetail', ['$scope', '$rootScope', '$routeParams', 'FeedsService', '$q', '$modalInstance',
    function($scope, $rootScope, $routeParams, $q, $modalInstance) {

    }]);

angular.module('atlasAdmin.manageSourcesWriters')
  .controller('AddWriterTypeaheadCtrl', function($scope, $modalInstance, Applications) {
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
  });

angular.module('atlasAdmin.manageWishlist')
  .controller('CtrlNewWishlistItemModal', ['$scope', '$rootScope', '$modalInstance', 'factoryPropositions',
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
  }]);

angular.module('atlasAdmin.wishlist')
  .controller('customFeatureRequestModal', ['$scope', '$rootScope', '$routeParams', '$q',
      function($scope, $rootScope, $routeParams, $q) {

  }]);

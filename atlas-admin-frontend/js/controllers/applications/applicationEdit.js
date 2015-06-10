'use strict';

angular.module('atlasAdmin.controllers.applications')
.controller('CtrlApplicationEdit', ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', 'SourceLicenses', 'Authentication', 'atlasApiHost', '$modal', '$sce', '$log', '$http', '$q', 'APIUsage', 'Atlas',
    function($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, Authentication, atlasApiHost, $modal, $sce, $log, $http, $q, Usage, Atlas) {

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

    // function Graph(data) {
    //     var histogram = data.facets[0].entries;
    //     var maxCount = _.max(histogram, function(n) {
    //         return n.count;
    //     });

    //     this.clear_graph();

    //     var margin = {top: 30, right: 30, bottom: 60, left: 60},
    //         width = 1000 - margin.left - margin.right,
    //         height = 400 - margin.top - margin.bottom;

    //     this.startTime = null;
    //     this.endTime = null;

    //     this.create_axes = function() {
    //         var x = d3.time.scale().domain([this.startTime, this.endTime]).range([0, width]);
    //         var y = d3.scale.linear().domain([0, (maxCount.count + 100)]).range([height, 0]);
    //         var line = d3.svg.line()
    //             .x(function(d,i) { 
    //                 return x(d.time); 
    //             })
    //             .y(function(d) { 
    //                 return y(d.count); 
    //             })

    //         var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
    //         Graph.prototype.graph.append("svg:g")
    //              .attr("class", "x axis")
    //              .attr("transform", "translate(0,"+height+")")
    //              .call(xAxis);

    //         var yAxis = d3.svg.axis().scale(y).ticks(4).orient("left");
    //         Graph.prototype.graph.append("svg:g")
    //                   .attr("class", "y axis")
    //                   .attr("transform", "translate(-25,0)")
    //                   .call(yAxis);
    //         Graph.prototype.graph.append('svg:path').attr('d', line(histogram)).attr('class', 'graph-data');
    //     }

    //     this.draw = function() {
    //         Graph.prototype.graph = d3.select('.rpm-chart-container')
    //                        .append('svg:svg')
    //                        .attr("width", width + margin.left + margin.right)
    //                        .attr("height", height + margin.top + margin.bottom)
    //                        .append('svg:g')
    //                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //         this.create_axes();
    //     }
    // }

    // Graph.prototype.graph = null;
    // Graph.prototype.clear_graph = function() {
    //     if (this.graph) {
    //         $('.rpm-chart-container svg').remove();
    //         this.graph = null;
    //     }
    // }

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

    var makeGraph = function (barData, endTime, startTime) {
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
            bottom: 20,
            left: 50
        };        
        var xRange = d3.scale.ordinal()
            .rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1)
            .domain(barData.map(function(d) {
                return d.x;
            }
        ));
        var yRange = d3.scale.linear()
            .range([HEIGHT - MARGINS.top, MARGINS.bottom])
            .domain([0, d3.max(barData, function(d) {
                return d.y;
            })
        ]);
        var xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true);
        var yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient("left")
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
        .attr('fill', 'grey');   // fills the bar with grey color
    };

    var loadGraphHour = function (apiKey) {
        var _key = apiKey || '';
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'hour';
            $('.graph-caption').text('API requests over the past hour');
            Usage.hour(_key).then(function (data) {
                var endTime = new Date();
                var startTime = new Date(new Date().setHours(endTime.getHours() - 1));
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('mm');
                    d.time = formattedDate;
                });
                makeGraph(data, endTime, startTime);
                removeLoadingState();
            }, function (err) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };

    var loadGraphDay = function (apiKey) {
        var _key = apiKey || '';
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'day';
            $('.graph-caption').text('API requests over the past day');
            Usage.day(_key).then(function (data) {
                var endTime = new Date();
                var startTime = new Date(new Date().setHours(endTime.getHours() - 24));
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('HH');
                    d.time = formattedDate;
                });
                makeGraph(data, endTime, startTime);
                removeLoadingState();
            }, function (error) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };

    var loadGraphWeek = function (apiKey) {
        var _key = apiKey || '';
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'week';
            $('.graph-caption').text('API requests over the past week');
            Usage.week(_key).then(function (data) {
                var endTime = new Date();
                var startTime = new Date(new Date().setDate(endTime.getDate() - 7));
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('Do MMM');
                    d.time = formattedDate;
                });
                makeGraph(data, endTime, startTime);
                removeLoadingState();
            }, function (error) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };  

    var loadGraphMonth = function (apiKey) {
        var _key = apiKey || '';
        if (_key.length) {
            showLoadingState();
            $scope.tabState = 'month';
            $('.graph-caption').text('API requests over the past month');
            Usage.month(_key).then(function (data) {
                var endTime = new Date();
                var startTime = new Date(new Date().setDate(endTime.getDate() - 30));
                data = data.facets[0].entries;
                data.forEach(function (d) {
                    var formattedDate = moment(d.time).format('Do MMM');
                    d.time = formattedDate;
                });
                makeGraph(data, endTime, startTime);
                removeLoadingState();
            }, function (error) {
                $scope.errorMessage('Can\'t load data for the api key');
            });
        }
    };

    var closeUsageGraph = function () {
        $('.close-usage-graph').on('click', function () {
            $('.chart-card').slideUp();
        });
    };

    var toggleUsageGraph = function () {
        $('.api-usage-trigger').on('click', function () {
            var $graphContainer = $('.chart-card');
            if ($graphContainer.is(':visible')) {
                $graphContainer.slideUp();
            } else {
                if ($('.rpm-chart-container svg').length <= 0) {
                    getApiKey('week');
                }
                $graphContainer.slideDown();
            }
        });
    };

    toggleUsageGraph();
    closeUsageGraph();

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

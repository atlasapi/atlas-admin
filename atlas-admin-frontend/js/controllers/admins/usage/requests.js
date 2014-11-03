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
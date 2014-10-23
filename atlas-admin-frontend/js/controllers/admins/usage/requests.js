'use strict';
var app = angular.module('atlasAdmin.controllers.admins.usage', []);

app.controller('CtrlUsage', ['$scope', '$rootScope', 'APIUsage', 
    function($scope, $rootScope, Usage) {
     
    var make_graph = function(timePeriod, data) {
        var histogram = data.facets[0].entries;;
        console.log(histogram);

        var maxCount = _.max(histogram, function(n) {
            return n.count;
        });

        // define all the things for the graph
        var endTime = new Date();
        var startTime = new Date(new Date().setHours(endTime.getHours()-24));
        console.log(startTime)
        console.log(endTime)

        var margin = {top: 30, right: 30, bottom: 60, left: 60},
            width = 1000 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var x = d3.time.scale().domain([startTime, endTime]).range([0, width]);
        var y = d3.scale.linear().domain([0, (maxCount.count + 100)]).range([height, 0]);

        var req_graph = d3.select('.rpm-chart-container').append('svg:svg')
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append('svg:g')
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var line = d3.svg.line()
            .x(function(d,i) { 
                return x(d.time); 
            })
            .y(function(d) { 
                return y(d.count); 
            })

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
        // Add the x-axis
        req_graph.append("svg:g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);


        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        req_graph.append("svg:g")
              .attr("class", "y axis")
              .attr("transform", "translate(-25,0)")
              .call(yAxisLeft);

        req_graph.append('svg:path').attr('d', line(histogram));
    }

    Usage.day('84097c4de516445eb7bb58f4b73d2842').then(function(data) {
        make_graph('day', data)
    });
    
}]);
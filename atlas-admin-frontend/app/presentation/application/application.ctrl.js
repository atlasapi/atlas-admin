'use strict';

angular.module('atlasAdmin.application')
    .controller('CtrlApplicationEdit', CtrlApplicationEdit);

CtrlApplicationEdit.$inject = ['$scope', '$rootScope', '$routeParams', 'Applications', 'Sources', 'SourceLicenses', 'Authentication', 'atlasApiHost', '$uibModal', '$sce', '$log', '$http', '$q', 'APIUsage', 'Atlas', '$location'];

function CtrlApplicationEdit($scope, $rootScope, $routeParams, Applications, Sources, SourceLicenses, Authentication, atlasApiHost, $uibModal, $sce, $log, $http, $q, Usage, Atlas, $location) {
  $scope.app = {};
  $scope.app.edited = {'meta':false,'precedenceState':false,'precedenceOrder':false};
  $scope.app.changed = false;
  $scope.view_title = 'Edit application';
  $scope.isAdmin = false;
  $scope.app.loading = false;

  var leavingPageText = 'You have unsaved changes!';

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
    $scope.app.loading = true;
    $('#visualisation').empty();
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
              loadGraphData({
                apiKey: apiKey,
                format: 'HH:mm',
                timeType: timeRange
              });
              break;
          case 'day':
              loadGraphData({
                apiKey: apiKey,
                format: 'HH',
                timeType: timeRange
              });
              break;
          case 'week':
              loadGraphData({
                apiKey: apiKey,
                format: 'Do MMMM',
                timeType: timeRange
              });
              break;
          case 'month':
              loadGraphData({
                apiKey: apiKey,
                format: 'Do MMMM',
                timeType: timeRange
              });
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

  var loadGraphData = function (options) {
      var _key = options.apiKey || '';
      $location.search({usage: options.timeType});
      if (_key.length) {
          showLoadingState();
          $scope.tabState = options.timeType;
          $('.graph-caption').text('API requests over the past ' + options.timeType);
          Usage[options.timeType](_key).then(function(){
            data = data.facets[0].entries;
            data.forEach(function (d) {
              var formattedDate = moment(d.time).format(options.format);
              if (options.timeType === 'day') {
                d.time = formattedDate + ':00';
              } else {
                d.time = formattedDate;
              }
            });
            makeGraph(data);
            $scope.app.loading = false;
          }, function (error) {
              $scope.errorMessage('Can\'t load data for the api key');
          });
      }
  };

  var checkForDuplicates = function () {
    $scope.app.application.sources.reads = _.uniqBy($scope.app.application.sources.reads, 'id');
    $scope.app.application.sources.writes = _.uniqBy($scope.app.application.sources.writes, 'id');
  };

  $scope.closeUsageGraph = function () {
    $('.chart-card').slideUp('fast');
  };

  $scope.toggleUsageGraph = function () {
    var $graphContainer = $('.chart-card');
    if ($graphContainer.is(':visible')) {
      $graphContainer.slideUp('fast');
    } else {
      if ($('.usage-graph g').length <= 0) {
        getApiKey('week');
      }
      $graphContainer.slideDown('fast');
    }
  };

  $scope.reloadGraph = function () {
      var timePeriod = $location.search().usage;
      getApiKey(timePeriod);
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
      source.enabled = false;
      $scope.app.edited.meta = true;
  };

  $scope.app.enableSource = function(source) {
      source.enabled = true;
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
      var modalInstance = $uibModal.open({
          templateUrl: 'presentation/applications/sourceRequestModal/sourceRequestModal.tpl.html',
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
      // Remove any duplicated read sources
      checkForDuplicates();

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

      var modalInstance = $uibModal.open({
          templateUrl: 'presentation/application/viewTermsModal.tpl.html',
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
              console.log($scope.app.edited);
          }
          return;
      });
  }, true);

  // @TODO: if the user changes the model back to the way how it was
  // before the UI was touched, `app.changed` should be `false`
};

'use strict';
var app = angular.module('atlasAdmin.controllers.contact', []);
app.controller('ContactController', ['$scope', '$rootScope', '$sce', 'Users', 'GroupsService', 'Applications', '$q',
  function($scope, $rootScope, $sce, Users, Groups, Applications, $q) {
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

      var addGroups = function (groups) {
        var defer = $q.defer();

        var tools = [];
        if (groups.length > 0) {
          groups.forEach(function (tool) {
            tools.push({
              name: tool.name,
              value: tool.name
            });
          });
        }

        defer.resolve({
          tools: tools
        });

        return defer.promise;
      };

      var addApplications = function (items) {
        var defer = $q.defer();

        var applications = [];

        applications.push({
          name: '',
          value: ''
        });

        var promises = [];
        user.applications.forEach(function (application) {
          promises.push(Applications.get(application));
        });

        $q.all(promises).then(function (data) {
          items.applications = data;
          defer.resolve(items);
        }.bind(this));

        return defer.promise;
      };

      getPrivateMenuItems().then(addGroups).then(addApplications).then(function(items) {
        new window.MBST.Contact('stage', {
          product: 'atlas',
          fields: (function () {
            var result = [];

            var subjects = [];

            if (items.tools.length > 0) {
              subjects.push({
                type: 'group',
                name: 'My Tools',
                options: items.tools
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

            var applications = items.applications.map(function (item) {
              return {
                name: item.title,
                value: item.title + ' (' + item.id + ' - ' + item.credentials.apiKey + ')'
              };
            });

            var applicationsInput = [{
              type: 'select',
              label: 'Application',
              attrs: {
                name: 'Application',
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

            if (items.tools.length > 0) {
              result = result.concat(groupsInput);
            }

            if (items.applications.length > 0) {
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
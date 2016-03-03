'use strict';
var app = angular.module('atlasAdmin.controllers.contact', []);
app.controller('ContactController', ['$scope', '$rootScope', '$compile',
  function($scope, $rootScope, $compile) {
    $rootScope.view_title = 'Contact Us';
    console.log($scope.$element);
    new window.MBST.Contact('stage', {
      product: 'atlas',
      fields: [
        {
          type: 'select',
          label: 'Subject',
          attrs: {
            required: 'required',
            name: 'subject',
            options: [
              {
                type: 'group',
                name: 'My Tools',
                options: [
                  {
                    name: 'blackout',
                    value: '\tBlackout'
                  },
                  {
                    name: 'panels',
                    value: '\tPanels'
                  }
                ]
              },
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
            ]
          }
        },
        {
          type: 'textarea',
          label: 'Message',
          attrs: {
            required: 'required',
            name: 'message',
            rows: 4,
            maxLength: 500
          },
          value: ''
        }
      ]
    }, function (ele) {
      $scope.formEle = $compile(ele)($scope);
      $scope.$apply();

      console.log($scope.formEle);
    });

  }
]);
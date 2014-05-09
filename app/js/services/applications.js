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
        create: function(title) {
            var application = {
                'title': title,
                'description': '',
                'publisher': {
                    'key': 'metabroadcast.com',
                    'name': 'MetaBroadcast',
                    'country': 'ALL'
                }
            };
            return Atlas.postRequest('/applications.json', application);
        },
        update: function(application, callback) {
            return Atlas.postRequest('/applications.json', application);
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
        revokeApplication: function(application) {
            application.revoked = true;
            return Atlas.postRequest('/applications.json', application).then(function (results) {
                return results.data.application;
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
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
    //  @param method {string}
    //  @param params {object}
    //  @returns promise
    //
    var request = function(feed_uri, method, params) {
        var request;
        var defer = $q.defer();
        var method = method || 'get';
        var params = params || null;

        if (!_.isString(feed_uri)) {
            defer.reject('Feed uri must be included as first argument')
            return defer.promise;
        }

        request = {
            method: method,
            url: Authentication.appendTokenToUrl(atlasApiHost+'/feeds/'+feed_uri)
        }

        if (_.isObject(params)) {
            request.data = params;
        }

        $http(request).success(defer.resolve);
        return defer.promise;
    }
    

    //  Used for running actions on tasks
    //  
    //  @param action {string}
    //  @param tasks {object}
    //  @param selection {array}
    //
    var doAction = function(action, tasks, selection) {
        var defer = $q.defer();
        var action = action || null;
        var _tasks = tasks || null;
        var _selection = selection || null; 
        var _postdata = {};

        if (selection.length) {
            var counter = _selection.length;
            _selection.forEach(function(item) {
                var _selected = _.find(tasks, function(task) {
                    return task.id === item;
                });
                _postdata = {
                    uri: _selected.content_uri,
                    type: _selected.element_type,
                    element_id: _selected.element_id
                }
                request('youview/bbc_nitro/action/'+action, 'post', _postdata).then(function() {
                    counter--;
                    if (!counter) defer.resolve();
                });
            })
        }else{
            if (tasks.content_uri && tasks.element_type && tasks.element_id) {
                _postdata = {
                    uri: tasks.content_uri,
                    type: tasks.element_type,
                    element_id: tasks.element_id
                }
                request('youview/bbc_nitro/action/'+action, 'post', _postdata).then(function() {
                    defer.resolve();
                });
            }else{
                defer.reject();
            }
        }   
        return defer.promise;
    }

    return {
        action: doAction,
        get: getFeeds,
        request: request
    }
}]);

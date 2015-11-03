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
  //  @returns promise<$http Response, String>
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
      url: Authentication.appendTokenToUrl(atlasApiHost + '/feeds/' + feed_uri)
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

'use strict';
var config  = require('../../config');
var common      = require('../../common');
var express     = require('express');
var http        = require('http');
var Q           = require('q');
var qs          = require('querystring');
var _           = require('lodash');
var Feeds       = require('../services/feedsProvider');
var Atlas       = require('../services/atlasProvider');
var _feeds      = [];


//  Used for determining if a string is valid JSON or not
//
//  @returns {bool}
//
function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getAPIKey() {
  for (var feed in _feeds) {
    if (_feeds[feed].name === 'BBC to YouView') {
      return _feeds[feed].apiKey;
    }
  }
  return null;
}

//  Used for proxying requests to atlas and returning the result
//
//  @returns promise
//
function proxyRequest(endpoint, request) {
  var defer           = Q.defer();
  var _endpoint       = endpoint;
  var _querystring    = { apiKey: getAPIKey() };
  
  // Atlas complains when we send querystrings it doesnt understand, thus whitelist
  for (var query in request.query) {
    if ('status' === query ||
        'uri' === query ||
        'remote_id' === query ||
        'limit' === query ||
        'offset' === query ||
        'type' === query ||
        'annotations' === query) {
      _querystring[query] = request.query[query];
    } else {
      console.warn('I don\'t know about this querystring param = ' + query);
    }
  }
  
  console.log('proxying request for: `/3.0/feeds/youview/bbc_nitro/'+_endpoint+'?'+qs.stringify(_querystring) + '`');
  
  Atlas.api('/3.0/feeds/youview/bbc_nitro/'+_endpoint+'?'+qs.stringify(_querystring), 'GET', 
  function(status, data) {
    if (isJSON(data)) {
      defer.resolve(JSON.parse(data));
    }else{
      console.error(data);
      defer.reject(common.errors.invalid_json);
    }
  });
  return defer.promise;
}

function getXML(uri) {
  var defer = Q.defer(),
  _uri = uri || null,
  query = qs.stringify({apiKey: getAPIKey(), uri: _uri});
  if (_uri) {
    Atlas.api('/3.0/feeds/youview/bbc_nitro.xml?'+query, 'GET', function(status, data) {
      defer.resolve(data);
    });
  }
  return defer.promise;
}

function loadFeeds(req, res, next) {
  Feeds.getAll().then(function(feeds) {
    _feeds = feeds;
    next();
  }, next);
}

function forceContentIntoQueue (uri) {
  var defer = Q.defer();
  var querystring = {
    uri: uri,
    immediate: 'true'
  };
  
  var data = '';
  var options = {
    hostname: config.processingHost,
    path: '/feeds/youview/bbc_nitro/upload?' + qs.stringify(querystring),
    method: 'post'
  };
  
  var updateRequest = http.request(options,
  function (res) {
    res.setEncoding('utf8');
    
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      if (res.statusCode !== 202 && res.statusCode !== 200) {
        defer.reject('Force update failed ' + uri + ': ' + res.statusCode);
        return;
      }
      defer.resolve(res.statusCode);
    });
  });
  
  updateRequest.on('error', function () {
    defer.reject('Force update failed :(');
    res.writeHead(400);
  });
  
  updateRequest.end();
  return defer.promise;
}


//  REST interface for feeds
//
var feedsInterface = function() {
  var router  = express.Router();
  
  // Grab the feed from groups so before every request so the app uses
  // the correct api key
  router.use(loadFeeds);
  
  // Return a list of feeds
  router.route('/')
  .get(function(req, res) {
    res.end(JSON.stringify(_feeds));
  });
  
  // Return xml data
  router.route('/youview/bbc_nitro.xml')
  .get(function(req, res) {
    var _uri = req.query.uri || null;
    if (_uri) {
      getXML(_uri).then(function(xml) {
        res.setHeader('Content-Type', 'application/xml');
        res.end(xml);
      });
    }else{
      res.end(JSON.stringify(common.errors.invalid_data));
    }
  });
  
  
  
  // Actions endpoint. actions must be sent to a processing url
  router.route('/youview/bbc_nitro/action/:action')
  .post(function(req, res) {
    if (!_.isString(req.body.uri)) {
      res.end();
      return false;
    }
    var data;
    var uri = req.body.uri || '';
    var action = req.params.action || '';
    var querystring = {};
    querystring.uri = uri;
    
    var request_opts = {
      hostname: config.processingHost,
      path: '/feeds/youview/bbc_nitro/'+action+'?'+qs.stringify(querystring),
      method: 'post'
    };
    
    console.log(request_opts.hostname + request_opts.path);
    
    var action_request = http.request(request_opts, function(action_res) {
      action_res.setEncoding('utf8');
      
      action_res.on('data', function(chunk) {
        data += chunk;
      });
      
      action_res.on('end', function() {
        res.end();
      });
    });
    
    action_request.on('error', function(err) {
      console.error('Failed to get a response from processing server', err.message);
      res.writeHead(400);
      res.end();
    });
    action_request.end();
  });
  
  
  
  //  hardwired for now, catch the request to atlas so we can run
  //  auth checks before returning any data
  router.route('/youview/bbc_nitro/:endpoint')
  .get(function(req, res) {
    proxyRequest(req.params.endpoint, req).then(
    function(result) {
      res.end(JSON.stringify(result));
    }, function(err) {
      console.error(err);
      //  res.end(JSON.stringify(common.errors.request_error));
    });
  });
  
  router.route('/forceUpdate/:pid')
  .post( function (req, res) {
    
    if (! req.params.pid) {
      console.warn('Must have a pid');
      res.end();
    }
    
    var uri = 'http://nitro.bbc.co.uk/programmes/' + req.params.pid;
    
    var data = '';
    var options = {
      hostname: config.processingHost,
      path: '/system/bbc/nitro/update/content/' + req.params.pid,
      method: 'post'
    };
    
    console.log(options.hostname + options.path);
    
    
    var action_request = http.request(options, function(action_res) {
      action_res.setEncoding('utf8');
      
      console.log('publish status for PID ' + req.params.pid + ': ' + action_res.statusCode);
      
      action_res.on('data', function(chunk) {
        data += chunk;
      });
      
      action_res.on('end', function() {
        forceContentIntoQueue(uri).then(
        function () {
          console.log('Successfully force pushed content: ' + uri);
          res.end(data);
        }, 
        function (err) {
          res.end();
          console.error(err);
        });
      });
    });
    
    action_request.on('error', function(err) {
      console.error('Failed to get a response from processing server', err.message);
      res.writeHead(400);
      res.end();
    });
    action_request.end();
  });
  
  // For getting data about a particular task
  router.route('/youview/bbc_nitro/tasks/:task.json')
  .get(function(req, res) {
    proxyRequest('tasks/'+req.params.task+'.json', req).then(function(result) {
      res.end(JSON.stringify(result));
    }, function(err) {
      console.error(err);
      // res.end(JSON.stringify(common.errors.request_error));
    });
  });
  
  return router;
};

module.exports = feedsInterface;

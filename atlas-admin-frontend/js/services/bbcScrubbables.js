var app = angular.module('atlasAdmin.services.bbcscrubbables', []);

app.factory('BBCScrubbablesService', ['atlasHost', '$http', '$q', 'GroupsService',
  function(atlasHost, $http, $q, Groups) {

  var SCRUBBABLES_HOST = atlasHost.indexOf('stage') > -1 ? '//scrubbables-stage.metabroadcast.com' : '//scrubbables.metabroadcast.com';
  var owlAnnotations = 'annotations=description,extended_description,next_broadcasts,broadcasts,brand_summary,series_summary,upcoming,locations,available_locations';
  var deerAnnotations = 'annotations=segment_events,description,extended_description,series_summary,description';

  var getKeys = function() {
      var defer = $q.defer();
      Groups.get().then(function(res) {
          for (var i=0; i<res.length; i++) {
              if (res[i].name === 'BBC-Scrubbables') {
                  defer.resolve({
                      owlRead: res[i].data.searchApiKey,
                      owlWrite: res[i].data.writeApiKey,
                      deerRead: res[i].data.scrubbableApiKey
                  });
              }
          }
      }, defer.reject);
      return defer.promise;
  };

  var searchContent = function(apiKey, query) {
      var defer = $q.defer();
      var searchAnnotations = 'description,extended_description,next_broadcasts,brand_summary,channel_summary,series_summary,upcoming,related_links';
      $http.get(atlasHost + '/3.0/search.json?apiKey='+encodeURIComponent(apiKey)+'&q='+encodeURIComponent(query)+'&limit=10&type=item&annotations=' + searchAnnotations + '&topLevelOnly=false&specialization=tv,film&currentBroadcastsOnly=true')
           .success(function(data, status) {
              if (status >= 300) {
                  defer.reject('Atlas search returned an error. Status: '+status);
                  return;
              }
              defer.resolve(data);
           })
           .error(defer.reject);
      return defer.promise;
  };

  var getDeerContentURI = function(apiKey, id) {
      var defer = $q.defer();
      $http.get(atlasHost + '/4/content/' + id + '.json?key=' + encodeURIComponent(apiKey) + '&' + deerAnnotations)
           .success(function(data, status) {
              if (status !== 200) {
                  defer.reject('Atlas deer content request returned an error. Status:'+status);
              }else{
                  defer.resolve(data);
              }
           })
           .error(defer.reject);

      return defer.promise;
  };

  var getContentURI = function(apiKey, uri) {
      var defer = $q.defer();
      if (!_.isString(uri)) {
        defer.reject('uri is not a string');
        return defer.promise;
      }
      $http.get(atlasHost + '/3.0/content.json?apiKey='+encodeURIComponent(apiKey)+'&uri=' + encodeURIComponent(uri) + '&' + owlAnnotations)
          .success(function(data, status) {
              if (status !== 200) {
                  defer.reject('Atlas content request returned an error. Status:'+status);
              }else{
                  defer.resolve(data);
              }
          })
          .error(defer.reject);
      return defer.promise;
  };

  var getContentID = function(apiKey, id) {
      var defer = $q.defer();
      if (!_.isString(id)) {
        return null;
      }

      $http.get(atlasHost + '/3.0/content.json?apiKey='+encodeURIComponent(apiKey)+'&id=' + encodeURIComponent(id) + '&' + owlAnnotations).success(
      function(data, status) {
        if (status !== 200) {
          defer.reject('Atlas content request returned an error. Status:'+status);
        }else{
            defer.resolve(data);
        }
      })
        .error(defer.reject);
      return defer.promise;
  };

  // Create content block
  //
  // @param segments {array}
  // @param uri {string}
  // @param id {string}
  var createContentBlock = function(segments, uri, id) {
      var _template = {
          'segment_events': [],
          'same_as': [uri],
          'equivalents':[{'uri': uri, 'id': id}],
          'publisher': {
              'country': 'GB',
              'key': 'scrubbables-producer.bbc.co.uk',
              'name': 'BBC Scrubbables Producer'
          },
          'type': 'item',
          'uri':'http://scrubbables-frontend.metabroadcast.com/' + id
      };

      console.log(segments);
      if (typeof segments === 'object') {
          for (var i in segments) {
              var _segment = segments[i];
              var _event = {
                  'position': 0,
                  'offset': _segment.offset,
                  'segment': {
                      'duration': _segment.duration,
                      'segment_type': 'VIDEO',
                      'related_links':[
                          {
                              'type':'article',
                              'url':_segment.url,
                              'title':_segment.title,
                              'shortName':_segment.title,
                              'description': _segment.title,
                              'sourceId':'Source'
                          }
                      ]
                  }
              };
              _template.segment_events.push(_event);
          }
      }
      return _template;
  };


  // Post to owl
  //
  // @param apiKey {string}
  // @param data {object}
  var postToOwl = function (apiKey, data) {
    var defer = $q.defer();
    var _data = data || {};
    if (! _.isString(apiKey) ||
        ! _.isObject(_data.segments) ||
        ! _.isObject(_data.atlas)) {
        defer.reject(new Error('postToOwl() -> incorrect param'));
        return defer.promise;
    }
    var _postdata = createContentBlock( _data.segments,
                                        _data.atlas.uri,
                                        _data.atlas.id);

    var postRequest = $http({
      method: 'post',
      url: atlasHost + '/3.0/content.json?apiKey=' + apiKey,
      data: _postdata
    });

    postRequest.success(function (res, status, header) {
      var location = header('Location');
      if (! _.isString(location)) {
        console.warn('content id could not be grabbed from location');
        defer.reject();
      }
      var indexOfId = location.indexOf("id=");
      var contentId = location.substr(indexOfId + 3);
      defer.resolve(contentId);
    });
    return defer.promise;
  };


  var triggerMigration = function (id) {
    var defer = $q.defer();
    var migrationUri = SCRUBBABLES_HOST + '/1/scrubbables/' + id + '/migrate';
    if (! _.isString(id)) {
      defer.reject( new Error('id param must be a string') );
      return defer.promise;
    }
    $http.post(migrationUri).then(
    function (res) {
      console.log(res);
    });
    return defer.promise;
  };


  return {
      keys: getKeys,
      create: postToOwl,
      search: searchContent,
      migrateContent: triggerMigration,
      content: {
          uri: getContentURI,
          id: getContentID,
      },
      deerContent: getDeerContentURI
  };
}]);

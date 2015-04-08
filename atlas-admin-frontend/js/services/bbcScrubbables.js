var app = angular.module('atlasAdmin.services.bbcscrubbables', []);

app.factory('ScrubbablesHelpers', ['$q',
    function($q) {

    // Seconds -> HHMMSS
    //
    // Converts boring old seconds to object containing
    // HH MM SS as strings
    //
    // @return {Object} keys: hh, mm, ss
    function secondsToHHMMSS(secs) {
        if (typeof secs !== 'number' &&
            typeof secs !== 'string') {
            return null;
        }
        var _seconds = parseInt(secs, 10);
        var hours = Math.floor(_seconds/3600);
        var minutes = Math.floor((_seconds - (hours*3600)) / 60);
        var seconds = _seconds - (hours * 3600) - (minutes * 60);
        return {
            hh: (hours < 10) ? '0'+hours : hours.toString(),
            mm: (minutes < 10) ? '0'+minutes : minutes.toString(),
            ss: (seconds < 10) ? '0'+seconds : seconds.toString()
        };
    }


    // Channel filter
    //
    // Used for filtering atlas search results to only have items broadcast
    // on certain channels
    //
    // @param items {array} atlas search result array
    // @param channel_id {string}
    // @return {array}
    var channelFilter = function(items, channel_id) {
        if (!_.isObject(items) || !_.isString(channel_id)) {
            console.error('channelFilter() -> wrong type');
            return null;
        }
        for (var i=0; items.length > i; i++) {
            _result = _.filter(items[i].broadcasts, function(itm) {
                return (itm.channel.id === channel_id) ? true : false;
            });
            if (_result.length) {
                items[i].broadcasts = _result;
            }else{
                items[i] = null;
            }
        }
        return _.compact(items);
    };


    // Transmission time to formatted date
    //
    // @param time {string}
    var transmissionTimeToDate = function(time) {
        var _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var _date = time.split('T')[0];
        _date = new Date(_date.split('-')[0] + '/' +_date.split('-')[1] + '/' + _date.split('-')[2]);
        return {
            month: _months[_date.getMonth()],
            day: _date.getDate(),
            year: _date.getFullYear()
        };
    };


    // Format Atlas response
    //
    // @param item {object}
    // @returns {
    //  broadcast: {Object | null}.
    //  uri: {String},
    //  id: {String},
    //  title: {String},
    //  subtitle: {String},
    //  episode_number: {Number},
    //  duration: {Number},
    //  broadcast_date: {Object} { day:{String}, month:{String}, year:{String} }
    // }
    var formatAtlasResponse = function(item) {
        if (!_.isObject(item)) return;
        var _out = {};
        var broadcast = item.broadcasts[0] || null;
        var container = item.container || null;
        _out.broadcast = broadcast;
        _out.uri = item.uri;
        _out.id = item.id;
        _out.title = item.title;
        if (_.isObject(container)) {
            _out.title = (container.type === 'series' || container.type === 'brand')? container.title : item.title;
            if ((container.type === 'brand' || container.type === 'series') && !item.special) {
                _out.title = container.title;
                _out.subtitle = item.title;
                _out.episode_number = item.episode_number;
                _out.duration = secondsToHHMMSS(broadcast.duration);
            }
        }
        if (_.isObject(broadcast)) {
            _out.broadcast_date = transmissionTimeToDate(broadcast.transmission_time);
        }
        console.log(_out);
        return _out;
    };


    return {
        formatResponse: formatAtlasResponse,
        channelFilter: channelFilter
    };
}]);


app.factory('BBCScrubbablesService', ['atlasHost', '$http', '$q', 'GroupsService',
    function(atlasHost, $http, $q, Groups) {

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

    var getContentURI = function(uri) {
        if (!_.isString(uri)) return null;
        var defer = $q.defer();
        $http.get(atlasHost + '/3.0/content.json?uri=' + encodeURIComponent(uri) + '&' + owlAnnotations)
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

    var getContentID = function(id) {
        if (!_.isString(id)) return null;
        var defer = $q.defer();
        $http.get(atlasHost + '/3.0/content.json?id=' + encodeURIComponent(id) + '&' + owlAnnotations)
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
        if (!_.isString(apiKey) ||
            !_.isObject(_data.segments) ||
            !_.isObject(_data.atlas)) {
            defer.reject();
            console.error('postToOwl() -> incorrect param');
            return defer.promise;
        }
        var _postdata = createContentBlock( _data.segments,
                                            _data.atlas.uri,
                                            _data.atlas.id);

        $http.post(atlasHost + '/3.0/content.json?apiKey='+apiKey, _postdata)
        .success(function(res, status) {
            if (status === 200) {
                defer.resolve(_data.atlas.id);
            }else{
                defer.reject('nope', status);
            }
        })
        return defer.promise;
    }

    return {
        keys: getKeys,
        create: postToOwl,
        search: searchContent,
        content: {
            uri: getContentURI,
            id: getContentID,
        },
        deerContent: getDeerContentURI
    }
}]);

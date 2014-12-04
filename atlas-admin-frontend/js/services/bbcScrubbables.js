var app = angular.module('atlasAdmin.services.bbcscrubbables', []);

app.factory('BBCScrubbablesService', ['atlasHost', '$http', '$q',
    function(atlasHost, $http, $q) {

    // Create content block
    //
    // @param segments {array}
    // @param uri {string}
    // @param id {string}
    var createContentBlock = function(segments, uri, id) {
        var equiv = [{"uri": uri, "id": id}];
        var _template = {  
            "segment_events":[],
            "same_as": equiv,
            "equivalents": equiv,
            "publisher": {  
                "country":"GB",
                "key":"scrubbables-producer.bbc.co.uk",
                "name":"BBC Scrubbables Producer"
            },
            "uri": 'scrubbables-frontend.metabroadcast.com',
            "type": "item"
        };

        if (typeof segments === 'object') {
            for (var i in segments) {
                var _segment = segments[i]; 
                var _event = {  
                    "position": 0,
                    "offset": _segment.offset,
                    "segment": {  
                        "duration": _segment.duration,
                        "segment_type": "VIDEO",
                        "related_links": [  
                            {  
                                "type": "ARTICLE",
                                "url": _segment.url,
                                "title": _segment.title
                            }
                        ]
                    }
                }
                _template.segment_events.push(_event);
            }
        }
        console.log(_template)
        return _template;
    }


    // Post to owl
    //
    // @param data {object}
    var postToOwl = function(data) {
        var defer = $q.defer();
        var _data = data || {};
        if (typeof _data.segments !== 'object' ||
            typeof _data.atlas !== 'object') {
            defer.reject('nope');
            return defer.promise;
        }
        var _postdata = createContentBlock( _data.segments,  
                                            _data.atlas.uri,
                                            _data.atlas.id);
        $http.post(atlasHost.replace('stage.', '')+'/3.0/content.json?apiKey=8c47545e6d5c4c3c81ba9a818260b7cd', _postdata)
        .success(function(res, status) {
            if (status === 200) {
                defer.resolve(res);
            }else{
                defer.reject('nope', status);
            }
        })
        return defer.promise;
    }

    return {
        create: postToOwl
    }
}]);
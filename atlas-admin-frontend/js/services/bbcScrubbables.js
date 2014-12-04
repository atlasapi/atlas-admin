var app = angular.module('atlasAdmin.services.bbcscrubbables', []);

app.factory('BBCScrubbablesService', ['$http', 
    function($http) {

    var createContentBlock = function(segments, equivUri, equivId, uri) {
        var _template = {  
            "segment_events":[],
            "same_as":[  
                equivUri
            ],
            "equivalents":[  
                {  
                    "uri":equivUri,
                    "id":equivId
                }
            ],
            "publisher":{  
                "country":"GB",
                "key":"scrubbables-producer.bbc.co.uk",
                "name":"BBC Scrubbables Producer"
            },
            "uri": uri,
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

        console.log(_template);
        return _template;
    }

    var postToOwl = function(data) {
        var _data = data || {};
        if (typeof _data.segments !== 'object' ||
            typeof _data.atlas !== 'object') {
            return false;
        }
        var _postdata = createContentBlock( _data.segments, 
                                            _data.atlas.equivUri, 
                                            _data.atlas.equivId, 
                                            _data.atlas.uri);
        $http.post('http://atlas.metabroadcast.com/3.0/content.json?apiKey=8c47545e6d5c4c3c81ba9a818260b7cd', _postdata)
        .success(function(res) {
            console.log(res);
        })
    }

    return {
        create: postToOwl
    }

}]);
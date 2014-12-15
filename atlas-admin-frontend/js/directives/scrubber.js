var app = angular.module('atlasAdmin.directives.bbcscrubbables', []);

app.directive('scrubber', ['$document', '$compile', 
    function($document, $compile) {

    var controller = function($scope, $el, $attr) {
        // Scrubber and timeline elements
        var EL = $($el);
        var TIMELINE = $('.scrubber-timeline', EL);
        var CREATED = $('.scrubber-created-segments', EL);

        // State variables
        var MOUSEDOWN = false;
        var IS_DRAGGING = false;
        var IS_FOCUSED = false;
        var CONTEXT_LENGTH;
        var CURSOR_POS;
        var CURSOR_TIME;

        // Any data that the below timeline objects contain will be
        // rendered in the draw function
        //
        // Shape of a TIMELINE_SEGMENT object:
        // {
        //  _id: string
        //  startTime: number
        //  endTime: number
        // }
        var TIMELINE_SEGMENTS = [];
        var LIVE_ITEM = [];

        // Create the time marker component
        var TIME_MARKERS = templates().time_markers;
        EL.append( TIME_MARKERS );


        // Draw
        //
        // Used for drawing a 'frame'. All rendering stuff to the 
        // screen should be done in the draw method
        var _new_el;
        var _last_cursor_pos = {};
        function draw() {
            // Determine the difference between a 'drag' or a 'click'
            // by figuring out how much the mouse has moved since the 
            // last draw cycle
            if (MOUSEDOWN && !IS_DRAGGING) {
                if ((_last_cursor_pos.x-1 > CURSOR_POS.x) ||
                    (_last_cursor_pos.x+1 < CURSOR_POS.x)) {
                    IS_DRAGGING = true;
                }else{
                    IS_DRAGGING = false;
                }
                _last_cursor_pos = CURSOR_POS;
            }

            // When the cursor is dragging
            if (!LIVE_ITEM.length && 
                IS_DRAGGING && 
                MOUSEDOWN) {
                newTimelineItem();
            }

            // Render the new timeline item - this is the item that is 
            // currently being created or edited
            if (LIVE_ITEM.length) {
                if (!$('.scrubber-timeline-item', TIMELINE).length) {
                    _new_el = templates().timeline_item;
                    TIMELINE.append(_new_el);
                    _new_el.addClass('new');
                }
                if (IS_DRAGGING) {
                    LIVE_ITEM[0].end = (CURSOR_POS.x > LIVE_ITEM[0].start) ? CURSOR_POS.x : 1;
                }
                if (!MOUSEDOWN) {
                    showEditUI(_new_el);
                }
                _new_el.css('margin-left', LIVE_ITEM[0].start+'px');
                _new_el.css('width', LIVE_ITEM[0].end - LIVE_ITEM[0].start+'px');
            }else{
                clearImpermanentItems()
            }

            // Render segments to the timeline
            updateTimelineSegments();

            // Update the scrub time and position of marker elements when the cursor moves over the timeline
            updateCursorTime();
            if (CURSOR_TIME) {
                $('.scrubber-time-cursor .scrubber-time-label', TIME_MARKERS).text(CURSOR_TIME.hh+':'+CURSOR_TIME.mm+':'+CURSOR_TIME.ss);
                $('.scrubber-time-cursor', TIME_MARKERS).css('left', (CURSOR_TIME.width_ratio*100)+'%');
            }

            requestAnimationFrame(draw)
        }


        // Update timeline segments
        //
        // 
        function updateTimelineSegments() {
            var i, _item, _el, _segment_id;
            for (i in TIMELINE_SEGMENTS) {
                _item = TIMELINE_SEGMENTS[i];
                _segment_id = _item._id;
                if (_item) {
                    _el = $('[data-segment-id='+_segment_id+']', CREATED);
                    // If the element isn't in the dom, inject it
                    if (!_el.length) {
                        _el = templates().timeline_item;
                        _el.addClass('scrubber-on-timeline', _segment_id);
                        _el.attr('data-segment-id', _segment_id);
                        _el.css('margin-left', secondsToPixels(_item.startTime) +'px');
                        _el.css('width', secondsToPixels(_item.endTime) - secondsToPixels(_item.startTime) +'px');
                        _el.append('<h3>'+ _item.label +'</h3><p>'+ _item.url +'</p>');
                        _el.append('<span class="delete-segment" ng-click="scrubber.removeItem(\''+ _segment_id +'\')">x</span>')
                        CREATED.append(_el);
                        $compile($(_el))($scope);
                    }
                }
            }
        }


        // Pixels -> seconds 
        //
        // Turns a pixel x value into seconds relative to the timeline
        //
        // @param pixels {number | string} 
        // @returns seconds {number}
        function pixelsToSeconds(pixels) {
            if (typeof pixels !== 'number' && 
                typeof pixels !== 'string') {
                return null;
            }
            var _pixels = parseInt(pixels, 10) || 0;
            var _length = CONTEXT_LENGTH;
            var _timeline_width = TIMELINE.outerWidth();
            var _width_ratio = ((_pixels / _timeline_width) > 1) ? 1 : (_pixels / _timeline_width);
            return Math.round(_length * _width_ratio);
        }


        // Seconds -> pixels 
        //
        // Turns a seconds value pixels relative to the 
        // x-axis of the timeline
        //
        // @param seconds {number | string} 
        // @returns pixels {number}
        function secondsToPixels(seconds) {
            if (typeof seconds !== 'number' && 
                typeof seconds !== 'string') {
                return null;
            }
            var _seconds = parseInt(seconds, 10) || 0;
            var _length = CONTEXT_LENGTH;
            var _timeline_width = TIMELINE.outerWidth();
            var _position = (_seconds / _length) * _timeline_width;
            return Math.round(_position);
        }


        // For generating a unique id 
        //
        // @returns id {string}
        function generateID() {
            return Math.random().toString(36).substr(2, 9);
        }


        //  Clear impermanent items
        //
        // Clear the timeline of everything except items 
        // represented in TIMELINE_SEGMENTS 
        function clearImpermanentItems() {
            $('.scrubber-timeline-item.new', TIMELINE).remove();
            $('.scrubber-edit-dialog', TIMELINE).remove();
        }


        // New timeline item
        //
        // For pushing a new timeline item into the LIVE_ITEM array
        // starting at the current cursor position
        function newTimelineItem() {
            var _item = {
                start: CURSOR_POS.x
            };
            LIVE_ITEM.push(_item);
        }


        // Remove timeline segment
        //
        // Clear an item from the timeline segments array 
        //
        // @param id {string} the _id of the item
        function removeSegment(id) {
            if (!TIMELINE_SEGMENTS.length || !_.isString(id)) {
                return false;
            }
            // Splice from the TIMELINE_SEGMENTS array
            for (var i in TIMELINE_SEGMENTS) {
                if (TIMELINE_SEGMENTS[i]._id === id) {
                    TIMELINE_SEGMENTS.splice(i, 1);
                    break;
                }
            }
            // Remove from the DOM
            var _el = $('[data-segment-id='+ id +']', CREATED);
            if (_el.length) $(_el).remove();
        }


        function createSegmentObj(label, url, startTime, endTime, id) {
            return {
                label: label,
                url: url,
                startTime: startTime,
                endTime: endTime,
                _id: id
            }
        }


        // Add segment
        //
        // Pushes a new segment into the global TIMELINE_SEGMENTS array
        // based on passed properties
        //
        // @param new_segment {Object} the options for the new segment
        function addSegment() {
            var _create = $scope.scrubber.create;
            if (typeof _create.url !== 'string' || 
                typeof _create.label !== 'string' ||
                !LIVE_ITEM.length) {
                return false;
            }
            var _segment = createSegmentObj($scope.scrubber.create.label, 
                            $scope.scrubber.create.url, 
                            (pixelsToSeconds(LIVE_ITEM[0].start) < 0) ? 0 : pixelsToSeconds(LIVE_ITEM[0].start),
                            pixelsToSeconds(LIVE_ITEM[0].end),
                            generateID());
            if (_segment.label && _segment.url) {
                $scope.scrubber.clearTempSegment();
                TIMELINE_SEGMENTS.push(_segment);
            }else{
                console.error('Couldnt make new segment with data', _segment);
            }
            $scope.scrubber.segments = TIMELINE_SEGMENTS;
        }

        // Get cursor position
        //
        // For getting the current cursor position relative to the 
        // TIMELINE dom element, and writing it to CURSOR_POS variable
        function getCursorPosition() {
            CURSOR_POS = CURSOR_POS || {x:0, y:0};
            var _el_offset = TIMELINE.offset();
            EL.on('mousemove', function (e) {
                var x = (e.pageX - _el_offset.left);
                var y = (e.pageY - _el_offset.top);
                CURSOR_POS = { x: x, y: y };
            });
        }


        // Update cursor time
        //
        // For calculating time and updating the CURSOR_TIME variable
        function updateCursorTime() {
            var _seconds = pixelsToSeconds(CURSOR_POS.x);
            var _time = secondsToHHMMSS(_seconds);
            var _timeline_width = TIMELINE.outerWidth();
            if (_time) {
                CURSOR_TIME = _time;
                CURSOR_TIME.width_ratio = CURSOR_POS.x / _timeline_width;
            }
        }


        // Get context length
        //
        // Used for getting the context length in seconds from the 
        // data-scrubber-length attribute
        function getContextLength() {
            CONTEXT_LENGTH = parseInt($attr.scrubberLength, 10);
        }


        // Show edit UI
        //
        // Bring up the edit dialog box
        //
        // @param element {DOMObject} the timeline element to append to
        function showEditUI (element) {
            if (!$('.scrubber-edit-dialog', TIMELINE).length) {
                var edit_ui = templates().edit_bubble;
                $(element).append(edit_ui);
                $compile($(element))($scope);
            }
        }


        // Seconds -> HHMMSS
        //
        // Converts boring old seconds to object containing 
        // HH MM SS as strings
        //
        // @returns {Object} keys: hh, mm, ss
        function secondsToHHMMSS (secs) {
            if (typeof secs !== 'number' && 
                typeof secs !== 'string') {
                return null;
            }
            var _seconds = parseInt(secs, 10);
            var hours = (Math.floor(_seconds/3600) < 0) ? 0 : Math.floor(_seconds/3600);
            var minutes = Math.floor((_seconds - (hours*3600)) / 60);;
            var seconds = _seconds - (hours * 3600) - (minutes * 60);
            return {
                hh: (hours < 10) ? '0'+hours : hours.toString(),
                mm: (minutes < 10) ? '0'+minutes : minutes.toString(),
                ss: (seconds < 10) ? '0'+seconds : seconds.toString()
            }
        }


        // Set time markers
        //
        // Populate the times markers based on the CONTEXT_LENGTH variable
        function setTimeMarkers() {
            var _running_time = secondsToHHMMSS(CONTEXT_LENGTH);
            if (_running_time) {
                var el_start = $('.scrubber-time-start .scrubber-time-label', TIME_MARKERS);
                var el_end = $('.scrubber-time-end .scrubber-time-label', TIME_MARKERS);
                el_start.text('00:00:00');
                el_end.text(_running_time.hh+':'+_running_time.mm+':'+_running_time.ss);
            }
        }


        // Templates povider
        //
        // A provider that returns jQuery elements for use as templates.
        // See return value for available templates 
        //
        // @returns {Object}
        function templates() {
            var timeline_item = function() {
                return $('<div class="scrubber-timeline-item"></div>');
            }

            var edit_bubble = function() {
                var lines = [];
                lines.push('<div class="scrubber-edit-dialog">');
                lines.push('<h2>New segment</h2>');
                lines.push('<div class="scrubber-form-row"><input type="text" ng-model="scrubber.create.label" placeholder="label"></div>');
                lines.push('<div class="scrubber-form-row"><input type="url" ng-model="scrubber.create.url" placeholder="http://"></div>');
                lines.push('<div class="scrubber-button-group"><button class="cancel" ng-click="scrubber.clearTempSegment()">Cancel</button><button class="create" ng-click="scrubber.createLink()">Create link</button></div>');
                lines.push('</div>');
                return $(lines.join(''));
            }

            var time_markers = function() {
                var lines = [];
                lines.push('<div class="scrubber-times-container">');
                lines.push('<div class="scrubber-time-start"><span class="scrubber-time-label"></span></div>');
                lines.push('<div class="scrubber-time-cursor hide"><span class="scrubber-time-label"></span></div>');
                lines.push('<div class="scrubber-time-end"><span class="scrubber-time-label"></span></div>');
                lines.push('</div>');
                return $(lines.join(''));
            }

            return {
                timeline_item: timeline_item(),
                edit_bubble: edit_bubble(),
                time_markers: time_markers()
            }
        }


        // Bootstrap
        //
        // Initialise all the things, and attach global events, and start
        // the draw process
        function bootstrap() {
            getCursorPosition();
            $scope.scrubber = {};
            $scope.scrubber.create = {};
            $scope.scrubber.segments = [];

            $scope.scrubber.createLink = addSegment;
            $scope.scrubber.removeItem = removeSegment;

            $scope.scrubber.clearTempSegment = function() {
                LIVE_ITEM = [];
                $scope.scrubber.create = {};
                return;
            }

            $scope.scrubber.loadSegments = function(segment) {
            return;
            if (segment.related_links.length) {
                var _segment, _item;
                for (var i in segment.related_links) {
                    _item = segment.related_links[i];
                    _segment = createSegmentObj(_item.title, 
                                                _item.url, 
                                                0, 
                                                segment.duration, 
                                                $scope.generateID());
                    $scope.showSegments.segments.push(_segment);
                    $scope.showSegments.showCreateUI = false;
                }
            }
        }

            $attr.$observe('scrubberLength', function() {
                getContextLength();
                setTimeMarkers();
            })

            EL
            .on('mouseenter', function (e) {
                IS_FOCUSED = true;
            })
            .on('mouseleave', function() {
                IS_FOCUSED = false;
            })

            TIMELINE
            .on('mousedown', function (e) {
                if ($(e.target).is('.scrubber-timeline, .scrubber-timeline-item')) {
                    MOUSEDOWN = true;
                }else{
                    MOUSEDOWN = false;
                }
            })
            .on('mouseup', function (e) {
                if (IS_DRAGGING) {
                    IS_DRAGGING = false;
                }
                MOUSEDOWN = false;
            });
            requestAnimationFrame(draw)
        }
        bootstrap();
    }


    return {
        template: '<div class="scrubber-created-segments"></div><div class="scrubber-timeline"></div>',
        link: controller
    }
}])
angular.module('atlasAdmin.services.scrubbableHelpers')
  .factory('ScrubbablesHelpers', ['$q',
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
            hh: (hours < 10) ? '0' + hours : hours.toString(),
            mm: (minutes < 10) ? '0' + minutes : minutes.toString(),
            ss: (seconds < 10) ? '0' + seconds : seconds.toString()
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
        console.log(channel_id);
        channel_id = channel_id.toLowerCase();
        for (var i=0; items.length > i; i++) {
          var _result = _.filter(items[i].broadcasts, function(itm) {
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
        if (!_.isObject(item)) {
          return;
        }

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
        return _out;
    };


    return {
        formatResponse: formatAtlasResponse,
        channelFilter: channelFilter
    };
  }]);

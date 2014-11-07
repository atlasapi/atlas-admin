'use strict';

// Anything that needs to be global to the app scope goes in here
var common = {
    oauth: {
        provider: null,
        token: null
    },
        
    errors: {
        no_data: {'error': 'No data to return'},
        no_post_data: {'error': 'Request contains no data'},
        invalid_data: {'error': 'Payload data is invalid'},
        request_error: {'error': 'There was a problem with the request'},
        not_permitted: {'error': 'You dont have permission to access this resource'}
    },

    user: null,
    db: null
}

module.exports = common;
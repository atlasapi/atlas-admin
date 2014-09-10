// Anything that needs to be global to the app scope does in here
var common = {
    oauth: {
        provider: null,
        token: null
    },
        
    responses: {
        no_data: {'error': 'No data'}
    },

    user: null
}

module.exports = common;
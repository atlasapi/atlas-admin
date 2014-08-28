module.exports = function() {
    var atlasHost = 'localhost';

    // Configure the database
    var databaseHost    = 'localhost';
    var databaseUser    = 'admin';
    var databaseName    = 'atlasadmin';

    // Default paths
    var apiRootPath = '/api';

    // Allowed domains
    var allowedDomains = ['http://localhost:8000'];

    return {
        atlasHost: atlasHost,

        database: {
            host: databaseHost,
            user: databaseUser,
            name: databaseName
        },

        paths: {
            apiRoot: apiRootPath
        },

        allowedDomains: allowedDomains
    }
}();
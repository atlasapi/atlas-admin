module.exports = function() {
    'use strict'
    var atlasHost = 'stage.atlas.metabroadcast.com';
    var atlasApiHost = 'dev.mbst.tv:9000';
    var apiRootPath = '/api';

    // Configure the database
    var databaseHost    = 'localhost';
    var databaseUser    = 'admin';
    var databaseName    = 'atlasadmin';

    // Allowed domains for cross-origin requests
    var allowedDomains = ['http://localhost:8000', 'http://dev.mbst.tv:8000'];

    return {
        atlasHost: atlasHost,
        atlasApiHost: atlasApiHost,

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
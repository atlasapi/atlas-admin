module.exports = function() {
    'use strict';

    var instanceConfig = {};
    try {
        instanceConfig = require('./instance-config.js');
    } catch (fileMissing) {}

    return {
        atlasHost: instanceConfig.atlasHost || 'stage.atlas.metabroadcast.com',
        atlasApiHost: instanceConfig.host || 'dev.mbst.tv:9000',

        database: instanceConfig.database || {
            host: 'localhost',
            user: 'admin',
            name: 'atlasadmin',
            password: null
        },

        paths: {
            apiRoot: instanceConfig.apiRootPath || '/api'
        },

        allowedDomains: instanceConfig.allowedDomains || ['http://localhost:8000', 'http://dev.mbst.tv:8000']
    };
}();

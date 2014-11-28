module.exports = function() {
    'use strict';

    var instanceConfig = {};
    try {
        instanceConfig = require('./instance-config.js');
    } catch (fileMissing) {}

    return {
        atlasHost: instanceConfig.atlasHost || 'stage.atlas.metabroadcast.com',

        port: {
            http: instanceConfig.listenPort || 9000,
            mongo: 27017
        },


        database: instanceConfig.database || 'mongodb://localhost:27017/atlasadmin',

        paths: {
            apiRoot: instanceConfig.apiRootPath || '/api'
        },

        allowedDomains: instanceConfig.allowedDomains || ['http://localhost:8000', 'http://dev.mbst.tv:8000']
    };
}();

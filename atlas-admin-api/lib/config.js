module.exports = function() {
    var atlasHost = 'localhost';

    // Configure the database
    var databaseHost    = 'localhost';
    var databaseUser    = 'admin';
    var collectionName  = 'atlasadmin';

    // Default paths
    var apiRootPath = '/api';

    return {
        atlasHost: atlasHost,

        database: {
            host: databaseHost,
            user: databaseUser,
            collection: collectionName
        },

        paths: {
            apiRoot: apiRootPath
        }
    }
}();
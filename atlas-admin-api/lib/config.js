module.exports = function() {
    var atlasHost = 'localhost';

    // Database config
    var databaseHost = 'localhost';
    var databaseUser = 'admin';
    var databaseName = 'atlasadmin';

    return {
        atlasHost: atlasHost,
        dbHost: databaseHost,
        dbUser: databaseUser,
        dbName: databaseName
    }
}();
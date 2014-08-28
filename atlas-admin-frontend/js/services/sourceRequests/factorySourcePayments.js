var app = angular.module('atlasAdmin.services.sourceRequests');

app.factory('factorySourcePayments', function() {
    var plans = function() {
        return [{
            users: '1 to 10',
            price: 'Free'
        },
        {
            users: '11 to 1000',
            price: '£95'
        },
        {
            users: '1,001 to 10,000',
            price: '£245'
        },
        {
            users: '10,001 to 50,000',
            price: '£995'
        }];
    }

    return plans;
});
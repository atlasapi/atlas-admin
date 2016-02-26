var config = require('../../config');

module.exports = function allowCrossDomain(req, res, next) {
    var origin = req.headers.origin;
    if (config.allowedDomains.indexOf(origin) !== -1) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }else{
        // stop immediately
        res.status(401).send({error: 'Unauthorised Origin: ' + origin});
    }
}

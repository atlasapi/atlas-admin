var prepResponse = function(request, response, next) {
    response.setHeader('Content-Type', 'application/json');
    next();
}

module.exports = prepResponse;
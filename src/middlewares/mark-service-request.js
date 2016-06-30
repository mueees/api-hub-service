module.exports = function (request, response, next) {
    request.headers['mue-request-source'] = 'service';

    next();
};
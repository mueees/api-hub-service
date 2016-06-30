module.exports = function (request, response, next) {
    request.headers['mue-request-source'] = 'web';

    next();
};
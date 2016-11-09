'use strict';

let config = require('config');
let services = config.get('services');
let request = require('request');

let error = require('mue-core/modules/error');
let log = require('mue-core/modules/log')(module);

const REQUEST_TIMEOUT = 30000;

function getRequestUrl(originalUrl) {
    // originalUrl - /api/service-name/record/id

    return '/api/' + originalUrl.split('/').slice(3).join('/');
}

module.exports = function (req, res, next) {
    let url = 'http://' + req.service.host + ':' + req.service.port + getRequestUrl(req.originalUrl);
    log.info('Redirected url: ' + url);

    let requestOptions = {
        url: url,
        method: req.method,

        headers: {
            'x-requested-with': 'XMLHttpRequest',
            'mue-user-id': req.headers['mue-user-id'],
            'mue-request-source': req.headers['mue-request-source']
        },

        json: true,
        timeout: REQUEST_TIMEOUT
    };

    if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
        requestOptions.body = req.body;
    }

    let requestToService = request(requestOptions);

    requestToService.on('error', function () {
        log.error(req.service.name + ' service is unreachable');
        log.error('Url: ' + url);
        log.error('Method: ' + req.method);

        next(error.getHttpError(400, 'Server error. Please try again'));
    });

    requestToService.pipe(res);
};
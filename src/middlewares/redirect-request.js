'use strict';

let assert = require('chai').assert;
let config = require('config');
let services = config.get('services');
let request = require('request');

let error = require('mue-core/modules/error');
let log = require('mue-core/modules/log')(module);

const REQUEST_TIMEOUT = 30000;

function getRequestUrl(originalUrl) {
    return '/api/' + originalUrl.split('/').slice(2).join('/');
}

module.exports = function (req, res, next) {
    assert.isString(req.headers['mue-request-source']);
    assert.isNumber(req.service.port);
    assert.isString(req.service.host);

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

    requestToService.on('error', function (err) {
        log.error('Api is unreachable');
        log.error(err);

        next(error.getHttpError(400, 'Api is unreachable'));
    });

    requestToService.pipe(res);
};
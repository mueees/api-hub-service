'use strict';

let assert = require('chai').assert;
let config = require('config');
let services = config.get('services');
let request = require('request');

let error = require('mue-core/modules/error');
let log = require('mue-core/modules/log')(module);

const REQUEST_TIMEOUT = 30000;

module.exports = function (req, res, next) {
    assert.isString(req.headers['mue-request-source']);
    assert.isNumber(req.service.port);
    assert.isString(req.service.host);

    let requestOptions = {
        url: 'http://' + req.service.host + ':' + req.service.port + req.originalUrl,
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
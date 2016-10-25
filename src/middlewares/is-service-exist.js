'use strict';

let config = require('config');
let _ = require('lodash');
let services = config.get('services');
let error = require('mue-core/modules/error');
let log = require('mue-core/modules/log')(module);

module.exports = function (request, response, next) {
    var service = _.find(services, {
        name: request.params.service
    });

    if (service) {
        request.service = service;

        next();
    } else {
        log.error('Cannot find ' + request.params.service);

        next(error.getHttpError(400, 'Server error. Please try again'));
    }
};
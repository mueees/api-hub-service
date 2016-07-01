'use strict';

let config = require('config');
let _ = require('lodash');
let services = config.get('services');
let error = require('mue-core/modules/error');

module.exports = function (request, response, next) {
    var service = _.find(services, {
        name: request.params.service
    });

    if (service) {
        request.service = service;

        next();
    } else {
        next(error.getHttpError(400, 'Cannot find service'));
    }
};
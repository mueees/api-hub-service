'use strict';

let markWebRequest = require('middlewares/mark-web-request');
let getAccessToken = require('middlewares/get-access-token');
let getUserId = require('middlewares/get-user-id');
let redirectRequest = require('middlewares/redirect-request');
let isServiceExist = require('middlewares/is-service-exist');

let markServiceRequest = require('middlewares/mark-service-request');

module.exports = function (app) {
    /**
     * WEB to Service request
     * */
    app.use('/api/:service/*', [
        isServiceExist,
        markWebRequest,
        getAccessToken,
        getUserId,
        redirectRequest
    ]);

    /**
     * Service to Service request
     * */
    app.use('/service/:service/*', [
        isServiceExist,
        markServiceRequest,
        redirectRequest
    ]);
};
'use strict';

let markWebRequest = require('middlewares/mark-web-request');
let getAccessToken = require('middlewares/get-access-token');
let getUserId = require('middlewares/get-user-id');
let redirectRequest = require('middlewares/redirect-request');
let isServiceExist = require('middlewares/is-service-exist');

let markServiceRequest = require('middlewares/mark-service-request');

module.exports = function (app) {
    /**
     * Allow Cross Origin Resource Sharing
     * */
    app.use(function (request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        next();
    });

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
'use strict';

/*CONFIG STAGE*/
if (process.env.NODE_ENV == 'development') {
    let path = require('path');

    // add another folder
    require('app-module-path').addPath(path.join(__dirname + './../../'));
}

/*RUN STAGE*/
let config = require('config');

// start api server
require('mue-core/modules/api-server')({
    name: config.get('name'),
    port: config.get('port'),

    init: function (app) {
        // initialize routes
        require('./routes')(app);
    }
});
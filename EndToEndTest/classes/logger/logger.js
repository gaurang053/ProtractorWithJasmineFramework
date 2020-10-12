'use strict';

const log4js = require('log4js');

class Logger {
    constructor(name) {
        this.logLevel = (global.browser) ? global.browser.params.logLevel : 'info';
        this._init();
        this.log = log4js.getLogger(name);
    }

    _init() {
        log4js.configure({
            appenders: {
                fileLog: { type: 'file', filename: './logs/ExecutionLog.log' },
                console: { type: 'log4js-protractor-appender' }
            },
            categories: {
                file: { appenders: ['fileLog'], level: 'error' },
                another: { appenders: ['console'], level: 'trace' },
                default: { appenders: ['console', 'fileLog'], level: this.logLevel }
            }
        });
    }
}

module.exports = Logger;

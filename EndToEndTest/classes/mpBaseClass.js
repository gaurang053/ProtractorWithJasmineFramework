'use strict';

const Utils = require('./utils/Utils.js');
const Logger = require('./logger/logger.js');
const logger = new Logger('mpBaseClass');
const log = logger.log;


/* Base class for Operator Portal pages
 *
 *
 */

class mpBaseClass {
    constructor() {
        this.EC = protractor.ExpectedConditions;
        this.envUrl = browser.baseUrl;
        this.utils = new Utils();
        this.toasterSuccess = element(by.className('toast-success'));
        this.saveErrorsRepeater = element.all(by.repeater('message in vm.SaveResponse.Errors track by \$index'));
        this.keyDelay = browser.params.productData.keyDelay || 100;
        this.infoFile = __dirname+'/../protractor.info' || null;
        this.infoFileName = this.infoFile ? this.utils.getLastPartByToken(this.infoFile, '/') : null;

        // timeouts in milli seconds
        this.timeOutMin = 3000;
        this.timeOutLow = 10000;
        this.timeOutMedium = 30000;
        this.timeOutHigh = 60000;
        this.timeOutExt = 95000;

        // fix MaxListenersExceededWarning: Possible EventEmitter memory leak detected
        process.setMaxListeners(0);
    }

    waitToastSuccess(mouseMoveElement=false) {
        log.info('Wait for ToastSuccess to apppear');

        browser.wait(result => {
            return this.toasterSuccess.isPresent();
        }, this.timeOutMedium, 'Toast Success not seen!').then(() => {
            // wait toastsuccess gone
            log.info('Wait for ToastSuccess is gone');

            // TODO: this is a workaround for freezing window need mouse move ....
            // DEV-35487 Bug: At adding business unit success toaster does not disappear
            if(mouseMoveElement) {
                log.info('Move mouse once during toaster success!');
                browser.actions().mouseMove(mouseMoveElement, {x: 10, y: 0}).perform();
            }

            browser.wait(this.EC.not(this.EC.presenceOf(this.toasterSuccess)),
                this.timeOutMedium,
                'Toaster success still there!');
        }).catch(err => {
            setTimeout(function() {
                throw new Error('Toaster appear/disappear failed: '+err);
            });
        });
    }

    errorCheck() {
        // Check if no error message in bottom of page
        log.info('Check for errors at bottom of page');
        browser.wait(this.EC.not(this.EC.presenceOf(this.saveErrorsRepeater)),
            this.timeOutMin,
            'Save Error found, see screenshot for error message!');
    }
}

module.exports = mpBaseClass;

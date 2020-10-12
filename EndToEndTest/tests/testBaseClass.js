'use strict';

const Utils = require('../classes/utils/Utils.js');
const utils = new Utils();
const dashBoard = require('../classes/pages/dashBoardPage');
const dashBoardPage = new dashBoard();
const mpBaseClass = require('../classes/mpBaseClass.js');
const mpBase = new mpBaseClass();
const Logger = require('../classes/logger/logger.js');
const logger = new Logger('testBaseClass');
const log = logger.log;

/* Base class for Operator Portal tests
 *
 *
 */

class testBaseClass {
    constructor() {
        this.log = log;
        this.utils = utils;
        this.dashBoardPage = dashBoardPage;
        this.mpBase = mpBase;
    }
}

module.exports = testBaseClass;

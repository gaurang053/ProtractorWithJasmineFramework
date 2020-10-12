'use strict';

const Utils = require('../classes/utils/Utils.js');
const utils = new Utils();
const dashBoard = require('../classes/pages/dashBoardPage.js');
const dashBoardPage = new dashBoard();
const searchAndSelectRestaurants = require('../classes/pages/searchAndSelectRestaurantsPage.js');
const searchAndSelectRestaurantsPage = new searchAndSelectRestaurants();
const orderAndPay = require('../classes/pages/orderAndPayPage.js');
const orderAndPayPage = new orderAndPay();

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
        this.searchAndSelectRestaurantsPage = searchAndSelectRestaurantsPage;
        this.orderAndPayPage = orderAndPayPage;
        this.mpBase = mpBase;
    }
}

module.exports = testBaseClass;

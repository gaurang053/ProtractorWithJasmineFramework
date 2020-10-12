'use strict';

const testBaseClass = require('../testBaseClass.js');
const testBase = new testBaseClass();

describe('Testing - Thuisbezorgd > Case 1', function () {
    it('Open Dashboard Page', function () {
        testBase.dashBoardPage.openPage();
    });
    it('Set Address', function () {
        testBase.dashBoardPage.setAddress();
    });
    it('Search And Select Restauratns', function () {
        testBase.dashBoardPage.searchAndSelectRestaurants();
    });
    it('Fill Customer form to order and pay', function () {
        testBase.dashBoardPage.customerPageToOrderAndPay();
    });
});

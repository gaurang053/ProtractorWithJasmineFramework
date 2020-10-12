'use strict';

const mpBaseClass = require('../mpBaseClass.js');
const dashBoardLocator = require('./locator/dashBoardLocator.js');
const dashBoardElement = new dashBoardLocator();
const Logger = require('../logger/logger.js');
const { browser, element } = require('protractor');
const logger = new Logger('loginPage');
const log = logger.log;

class dashBoardPage extends mpBaseClass {
    constructor() {
        super();
        this.homeAddress = browser.params.productData.homeAddress;
        this.homeAddressLink = browser.params.productData.homeAddressLink;
    }

    openPage() {
        log.info('Open Page with url: '+this.envUrl);
        browser.ignoreSynchronization = true;
        //Open Home Page
        browser.get(this.envUrl);
        //Assertion(s)
        expect(browser.getTitle()).toEqual(dashBoardElement.loginTitle);
    }

    setAddress() {
        log.info('Set Address & verify no of restaurants recored found as a result');
        browser.wait(this.EC.presenceOf(dashBoardElement.address), this.timeOutLow, 'wait for address filed to appear!');
        //Set Home Address
        browser.sleep(3000); 
        dashBoardElement.address.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
        dashBoardElement.address.sendKeys(protractor.Key.chord(protractor.Key.DEL));
        dashBoardElement.address.sendKeys(this.homeAddress);
        //Select the correct address like .. 8888 Alpha link
        dashBoardElement.linkShow.click();
        this.linkAlphaShow = element(by.xpath('//a[contains(.,"' + this.homeAddressLink + '")]'));
        browser.wait(this.EC.presenceOf(this.linkAlphaShow), this.timeOutLow, 'wait for link to appear!');
        //validate the dashboard page by verifying the URL
        var currentUrl = null;
        var actualUrl = null;
        browser.getCurrentUrl().then((url) => {
            currentUrl = url;
        });
        this.linkAlphaShow.click();
        browser.sleep(3000);
        // Wait for url to change
        browser.wait(() => {
            browser.getCurrentUrl().then((url) => {
                actualUrl = url;
            });
            return actualUrl !== currentUrl;
        }, this.timeOutLow, 'Url did not change!');
        //Verify the search result
        dashBoardElement.restaurantSearch.getText().then(function (searchResult) {
            log.info('No of restaurent prenet in page ' + searchResult)
        });
    }
}

module.exports = dashBoardPage;

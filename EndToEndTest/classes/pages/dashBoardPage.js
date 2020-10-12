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
        this.NameOfRestaurants = browser.params.productData.NameOfRestaurants;
        this.ProductAddToCart = browser.params.productData.ProductAddToCart;
        this.address = browser.params.customerInfo.address;
        this.postcode = browser.params.customerInfo.postcode;
        this.city = browser.params.customerInfo.city;
        this.name = browser.params.customerInfo.name;
        this.email = browser.params.customerInfo.email;
        this.phoneNumber = browser.params.customerInfo.phoneNumber;
        this.companyName = browser.params.customerInfo.companyName;
        this.deliveryTime = browser.params.customerInfo.deliveryTime;
        this.remark = browser.params.customerInfo.remark;
        this.paymentOption = browser.params.customerInfo.paymentOption;
    }

    openPage() {
        log.info('Open Page with url: '+this.envUrl);
        browser.ignoreSynchronization = true;
        browser.get(this.envUrl);
        //Assertion(s)
        expect(browser.getTitle()).toEqual(dashBoardElement.loginTitle);
    }

    setAddress() {
        log.info('Set Address & verify no of restaurants recored found as a result');
        browser.wait(this.EC.presenceOf(dashBoardElement.address), this.timeOutLow, 'wait for address filed to appear!');
        dashBoardElement.address.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
        dashBoardElement.address.sendKeys(protractor.Key.chord(protractor.Key.DEL));
        dashBoardElement.address.sendKeys(this.homeAddress);
        dashBoardElement.linkShow.click();
        browser.wait(this.EC.presenceOf(dashBoardElement.linkAlphaShow), this.timeOutLow, 'wait for link to appear!');
        
        var currentUrl = null;
        var actualUrl = null;
        browser.getCurrentUrl().then((url) => {
            currentUrl = url;
        });
        dashBoardElement.linkAlphaShow.click();
        browser.sleep(3000);
        // Wait for url to change
        browser.wait(() => {
            browser.getCurrentUrl().then((url) => {
                actualUrl = url;
            });
            return actualUrl !== currentUrl;
        }, this.timeOutLow, 'Url did not change!');
        dashBoardElement.restaurantSearch.getText().then(function (searchResult) {
            log.info('No of restaurent prenet in page ' + searchResult)
        });

    }

    searchAndSelectRestaurants() {
        log.info('Search and Select the specific restaurant from the list');
        dashBoardElement.searchSpecificRestaurants.sendKeys(this.NameOfRestaurants);
        browser.wait(this.EC.elementToBeClickable(dashBoardElement.selectSpecificRestaurants), this.timeOutMedium, 'Wait for Name to appear');
        dashBoardElement.selectSpecificRestaurants.click();
        expect(dashBoardElement.verifySpecificRestaurants.getText()).toEqual(this.NameOfRestaurants);
        
        this.selectMenuItem = element.all(by.xpath('//span[@data-product-name="' + this.ProductAddToCart + '"]/parent::span/parent::div/following::div[@class="js-meal__add-to-basket-button menucard-meal__sidedish-button"]')).first();
        browser.wait(this.EC.elementToBeClickable(this.selectMenuItem), this.timeOutMedium, 'Wait for add product to cart');
        this.selectMenuItem.click();
        this.selectProduct = element(by.xpath('//div[@class="sidedish-add-button meal-add-btn-wrapper"]/button'));
        browser.wait(this.EC.elementToBeClickable(this.selectProduct), this.timeOutMedium, 'Wait for button to appear for selecting product to cart');
        this.selectProduct.click();
        browser.wait(this.EC.elementToBeClickable(dashBoardElement.orderPlaced), this.timeOutMedium, 'Wait for order button to appear');
        dashBoardElement.orderPlaced.click();
        browser.sleep(3000);
        this.verifyCheckoutPage = element(by.xpath('//form[@id="checkoutform"]/h2[@class="checkout-form__restaurant-name"]'));
        expect(this.verifyCheckoutPage.getText()).toEqual(this.NameOfRestaurants);
    }

    customerPageToOrderAndPay() {
        log.info('Fill form to order and pay ');
        this.custAddress = element(by.xpath('//input[@name="address"]'));
        this.custAddress.sendKeys(this.address);
        this.custPostcode = element(by.xpath('//input[@name="postcode"]'));
        this.custPostcode.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
        this.custPostcode.sendKeys(protractor.Key.chord(protractor.Key.DEL));
        this.custPostcode.sendKeys(this.postcode);
        this.custTown = element(by.xpath('//input[@name="town"]'));
        this.custTown.sendKeys(this.city);
        this.custSurname = element(by.xpath('//input[@name="surname"]'));
        this.custSurname.sendKeys(this.name);
        this.custEmail = element(by.xpath('//input[@name="email"]'));
        this.custEmail.sendKeys(this.email);
        this.custPhoneNumber = element(by.xpath('//input[@name="phonenumber"]'));
        this.custPhoneNumber.sendKeys(this.phoneNumber);
        this.custCompanyName = element(by.xpath('//input[@name="companyname"]'));
        this.custCompanyName.sendKeys(this.companyName);
        this.custExpectedDeliveryTime = element(by.xpath('//select[@name="deliverytime"]'));
        this.custExpectedDeliveryTime.sendKeys(this.deliveryTime);
        this.custRemark = element(by.xpath('//textarea[@name="remarks"]'));
        this.custRemark.sendKeys(this.remark);
        this.custIdealBank = element(by.xpath('//label[text()="' + this.paymentOption + '"]/parent::div'));
        this.custIdealBank.click();
        this.orderAndPay = element(by.xpath('//input[@value="Order and pay"]'));
        this.orderAndPay.click();
        this.orderDetails = element(by.xpath('//div[@id="orderData"]'));
        this.orderDetails.getText().then(function (orderDetails) {
            log.info('Order details ' + orderDetails)
        });
        browser.sleep(1000);
    }
      
}

module.exports = dashBoardPage;

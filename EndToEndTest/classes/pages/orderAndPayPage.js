'use strict';

const mpBaseClass = require('../mpBaseClass.js');
const dashBoardLocator = require('./locator/dashBoardLocator.js');
const dashBoardElement = new dashBoardLocator();
const orderAndPayPageLocator = require('./locator/orderAndPayPageLocator.js');
const orderAndPayPageElement = new orderAndPayPageLocator();

const Logger = require('../logger/logger.js');
const { browser, element } = require('protractor');
const logger = new Logger('loginPage');
const log = logger.log;

class orderAndPayPage extends mpBaseClass {
    constructor() {
        super();
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
    customerPageToOrderAndPay() {
        log.info('Fill form to order and pay ');
        //Fill the customer information
        orderAndPayPageElement.custAddress.sendKeys(this.address);
        orderAndPayPageElement.custPostcode.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
        orderAndPayPageElement.custPostcode.sendKeys(protractor.Key.chord(protractor.Key.DEL));
        orderAndPayPageElement.custPostcode.sendKeys(this.postcode);
        orderAndPayPageElement.custTown.sendKeys(this.city);
        orderAndPayPageElement.custSurname.sendKeys(this.name);
        orderAndPayPageElement.custEmail.sendKeys(this.email);
        orderAndPayPageElement.custPhoneNumber.sendKeys(this.phoneNumber);
        orderAndPayPageElement.custCompanyName.sendKeys(this.companyName);
        //Select Delivery time
        orderAndPayPageElement.custExpectedDeliveryTime.sendKeys(this.deliveryTime);
        //Additional remark
        orderAndPayPageElement.custRemark.sendKeys(this.remark);
        //Select the payment option
        this.custIdealBank = element(by.xpath('//label[text()="' + this.paymentOption + '"]/parent::div'));
        this.custIdealBank.click();
        //Click on order and pay button
        orderAndPayPageElement.orderAndPay.click();
        //Redirect to bank page and validate the payment reference. 
        orderAndPayPageElement.orderDetails.getText().then(function (orderDetails) {
            log.info('Order details ' + orderDetails)
        });
        //Script end - holting execution to montior the script.
        //browser.sleep(1000);
    }
}
module.exports = orderAndPayPage;
const { element } = require("protractor");

class orderAndPayPageLocator {
    constructor() {
        this.custAddress = element(by.xpath('//input[@name="address"]'));
        this.custPostcode = element(by.xpath('//input[@name="postcode"]'));
        this.custTown = element(by.xpath('//input[@name="town"]'));
        this.custSurname = element(by.xpath('//input[@name="surname"]'));
        this.custEmail = element(by.xpath('//input[@name="email"]'));
        this.custPhoneNumber = element(by.xpath('//input[@name="phonenumber"]'));
        this.custCompanyName = element(by.xpath('//input[@name="companyname"]'));
        this.custExpectedDeliveryTime = element(by.xpath('//select[@name="deliverytime"]'));
        this.custRemark = element(by.xpath('//textarea[@name="remarks"]'));
        this.orderAndPay = element(by.xpath('//input[@value="Order and pay"]'));
        this.orderDetails = element(by.xpath('//div[@id="orderData"]'));

    }
}

module.exports = orderAndPayPageLocator;

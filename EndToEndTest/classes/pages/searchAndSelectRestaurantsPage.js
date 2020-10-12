'use strict';

const mpBaseClass = require('../mpBaseClass.js');
const dashBoardLocator = require('./locator/dashBoardLocator.js');
const dashBoardElement = new dashBoardLocator();
const searchAndSelectRestaurantsLocator = require('./locator/searchAndSelectRestaurantsLocator.js');
const searchAndSelectRestaurantsElement = new searchAndSelectRestaurantsLocator();

const Logger = require('../logger/logger.js');
const { browser, element } = require('protractor');
const logger = new Logger('loginPage');
const log = logger.log;

class searchAndSelectRestaurantsPage extends mpBaseClass {
    constructor() {
        super();
        this.NameOfRestaurants = browser.params.productData.NameOfRestaurants;
        this.ProductAddToCart = browser.params.productData.ProductAddToCart;
    }
    searchAndSelectRestaurants() {
        log.info('Search and Select the specific restaurant from the list');
        //select and verify the Restaurants
        searchAndSelectRestaurantsElement.searchSpecificRestaurants.sendKeys(this.NameOfRestaurants);
        browser.wait(this.EC.elementToBeClickable(searchAndSelectRestaurantsElement.selectSpecificRestaurants), this.timeOutMedium, 'Wait for Name to appear');
        searchAndSelectRestaurantsElement.selectSpecificRestaurants.click();
        expect(searchAndSelectRestaurantsElement.verifySpecificRestaurants.getText()).toEqual(this.NameOfRestaurants);
        //Expan the product by clicking menu item
        this.selectMenuItem = element.all(by.xpath('//span[@data-product-name="' + this.ProductAddToCart + '"]/parent::span/parent::div/following::div[@class="js-meal__add-to-basket-button menucard-meal__sidedish-button"]')).first();
        browser.wait(this.EC.elementToBeClickable(this.selectMenuItem), this.timeOutMedium, 'Wait for add product to cart');
        this.selectMenuItem.click();
        //Select the product
        browser.wait(this.EC.elementToBeClickable(searchAndSelectRestaurantsElement.selectProduct), this.timeOutMedium, 'Wait for button to appear for selecting product to cart');
        searchAndSelectRestaurantsElement.selectProduct.click();
        //Click on order button
        browser.wait(this.EC.elementToBeClickable(searchAndSelectRestaurantsElement.orderPlaced), this.timeOutMedium, 'Wait for order button to appear');
        searchAndSelectRestaurantsElement.orderPlaced.click();
        browser.sleep(3000);
        this.verifyCheckoutPage = element(by.xpath('//form[@id="checkoutform"]/h2[@class="checkout-form__restaurant-name"]'));
        expect(this.verifyCheckoutPage.getText()).toEqual(this.NameOfRestaurants);
    }     
}
module.exports = searchAndSelectRestaurantsPage;
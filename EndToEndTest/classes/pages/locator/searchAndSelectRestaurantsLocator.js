const { element } = require("protractor");

class searchAndSelectRestaurantsLocator {
    constructor() {
        this.searchSpecificRestaurants = element(by.xpath('//input[@id="irestaurantsearchstring-middle"]'));
        this.selectSpecificRestaurants = element(by.xpath('//a[@itemprop="name"][text()="Pan Pizza Man"]'));
        this.verifySpecificRestaurants = element(by.xpath('//div[@class="restaurant-name"]/h1'));
        this.orderPlaced = element(by.xpath('//button[@onClick="basket.proceedCheckout()"]'));
        this.selectProduct = element(by.xpath('//div[@class="sidedish-add-button meal-add-btn-wrapper"]/button'));

    }
}

module.exports = searchAndSelectRestaurantsLocator;

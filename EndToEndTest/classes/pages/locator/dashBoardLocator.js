const { element } = require("protractor");

class dashBoardLocator {
    constructor() {
        this.loginTitle = 'Thuisbezorgd.nl | Food delivery | Easily order pizza, sushi and other food online';
        this.address = element(by.id('imysearchstring'));
        this.linkShow = element(by.xpath('//a[normalize-space(text())="Show"]'));
        this.linkAlphaShow = element(by.xpath('//a[contains(.,"8888 Alpha")]'));
        this.restaurantSearch = element.all(by.xpath('//div[@class="card-filter"]/span[@class="restaurant-amount"]')).first();
        this.searchSpecificRestaurants = element(by.xpath('//input[@id="irestaurantsearchstring-middle"]'));
        this.selectSpecificRestaurants = element(by.xpath('//a[@itemprop="name"][text()="Pan Pizza Man"]'));
        this.verifySpecificRestaurants = element(by.xpath('//div[@class="restaurant-name"]/h1'));
        this.orderPlaced = element(by.xpath('//button[@onClick="basket.proceedCheckout()"]'));
        this.verifyCheckoutPage = element(by.xpath('//form[@id="checkoutform"]'));
    }
}

module.exports = dashBoardLocator;

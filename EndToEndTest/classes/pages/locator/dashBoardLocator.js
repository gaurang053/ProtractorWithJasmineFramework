const { element } = require("protractor");

class dashBoardLocator {
    constructor() {
        this.loginTitle = 'Thuisbezorgd.nl | Food delivery | Easily order pizza, sushi and other food online';
        this.address = element(by.id('imysearchstring'));
        this.linkShow = element(by.xpath('//a[normalize-space(text())="Show"]'));
        this.restaurantSearch = element.all(by.xpath('//div[@class="card-filter"]/span[@class="restaurant-amount"]')).first();
    }
}

module.exports = dashBoardLocator;

const protractorFixedConfigParts = require('../classes/config/protractorFixedConfigParts.js');
const protractorConfig = new protractorFixedConfigParts();

exports.config = {
    // for chrome and firefox standalone testing no need to start webdriver-manager
    // for cross browser testin or other browser start webdriver with start_webdriver.sh
    directConnect: true,

    baseUrl: 'https://www.thuisbezorgd.nl/en/',

    params: {
        logLevel: 'info',

        productData: {
            keyDelay: 100,
            homeAddress: '8888',
            homeAddressLink: '8888 Alpha',
            NameOfRestaurants: 'Pan Pizza Man',
            ProductAddToCart: 'BurgerDeal EN'
        },
        customerInfo: {
            address: 'main street 2415',
            postcode: '8888AA',
            city: 'Enschede',
            name: 'TestUSer',
            email: 'testuser@test.test',
            phoneNumber: '1234567890',
            companyName: 'Thuisbezorgd',
            deliveryTime: 'As soon as possible',
            remark: 'NoRemark',
            paymentOption: 'VVV Cadeaukaart'
        }
    },

    suites: {
        portal: '../tests/portal_access/portal_dashBoard.js'       
    },

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {'args': ['--window-size=1280,1024'] },
        //'chromeOptions': {'args': ['--headless', '--window-size=1280,1024'] },
        'shardTestFiles': true,
        'maxInstances': 1
    },

    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine',

    // Below specific config options are set
    jasmineNodeOpts: protractorConfig.setJasmineOptions(),

    beforeLaunch: function() {
        protractorConfig.beforeLaunch();
    },

    onPrepare: function() {
        protractorConfig.onPrepare();
    },

    onComplete: function() {
        protractorConfig.onComplete();
    }
};


'use strict';

const os = require('os');
const ifaces = os.networkInterfaces();
const fs = require('fs');
const currentPath = process.cwd();
const test_results_dir = currentPath + '/test_results';
const screenshotsDir = '/screenshots';
const Logger = require('../logger/logger.js');
const logger = new Logger('Utils');
const log = logger.log;

class Utils {
    constructor() {
        this.EC = protractor.ExpectedConditions;
        // timeouts in milli seconds
        this.timeOutMin = 3000;
        this.timeOutLow = 10000;
        this.timeOutMedium = 30000;
        this.timeOutHigh = 60000;
    }

    isJsonString(aString) {
        if(Array.isArray(aString)) {
            return false;
        }

        aString = typeof aString !== 'string' ? JSON.stringify(aString) : aString;
        try {
            aString = JSON.parse(aString);
        } catch(e) {
            return false;
        }

        if(typeof aString === 'object' && aString !== null) {
            return true;
        }

        return false;
    }

	makeScreenshot(pngName) {
        // function that takes screenshot and writes it to screenshots dir
		var timeStamp = this.getDateTimestamp();
		pngName = timeStamp+'_'+pngName;
		browser.takeScreenshot().then(function (png) {
			log.info('Making screenshot: '+pngName);
			var stream = fs.createWriteStream(test_results_dir+screenshotsDir+'/'+pngName);
			stream.write(new Buffer(png, 'base64'));
			stream.end();
		});
	}

    sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    getRandomNr(nrDigits) {
        var aMultiplier = 1;
        for(var x=1; x < nrDigits; x++) {
            aMultiplier = aMultiplier+'0';
            log.debug('getRandomNr aMultiplier: '+aMultiplier);
        }
        aMultiplier = Number(aMultiplier);
        return Math.floor((1 * aMultiplier) + Math.random() * (9 * aMultiplier));
    }

    isElementClickable(elm, name) {
        browser.wait(this.EC.elementToBeClickable(elm), this.timeOutMin, name+' element not clickable!').then(function(clickable) {
            log.info(name+'element is clickable is: '+clickable);
            return clickable;
        });
    }

    getLastPartByToken(name, aToken) {
        return name.split(aToken).slice(-1).pop();
    }

    getIpAddress() {
        var ipAddress = '127.0.0.1';
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;
            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    log.info(ifname + ':' + alias, iface.address);
                    ipAddress = iface.address;
                } else {
                    // this interface has only one ipv4 adress
                    log.info(ifname, iface.address);
                    ipAddress = iface.address;
                }
                ++alias;
            });
        });
        return ipAddress;
    }

    getVarType(myVar) {
        var testType = null;
        if(typeof myVar === 'string' || myVar instanceof String) {
            testType = 'string';
        }
        else if(myVar && myVar.constructor === Array) {
            testType = 'array';
        }
        else if(typeof myVar === 'number') {
            testType = 'number';
        }
        else if(myVar && typeof myVar === 'object') {
            testType = 'json';
        }
        return testType;
    }

    getExternalIdFromUrl(url) {
        var externalId = url.split('/').pop();
        return externalId.toUpperCase();
    }

    getProductIdFromUrl(url) {
        return url.split('/').pop();
    }

    readDataFromFile(fileName) {
        var data = null;
        if (fs.existsSync(fileName)) {
            data = fs.readFileSync(fileName);
            return data;
        }
        throw new Error('Something failed reading data from file: '+fileName);
    }

    writeDataToFile(destFile, data) {
        fs.writeFile(destFile, data, function(err) {
            if(err) {
                throw err;
            }
            log.info('Data written to: '+destFile);
            log.debug('Data: '+data+' written to: '+destFile);
        });
    }

    copyAndReplaceStringInFile(sourceFile, destFile, stringToReplace, replaceString, regexAdditionalParam='g') {
        // method to replace one or multiple strings to be replaced in a file
        fs.readFile(sourceFile, 'utf8', function (err1,data) {
            if (err1) {
                throw err1;
            }
            for(var x=0; x < stringToReplace.length; x++) {
                data = data.replace(new RegExp(stringToReplace[x], regexAdditionalParam), replaceString[x]);
                if(x == stringToReplace.length - 1) {
                    fs.writeFile(destFile, data, 'utf8', function (err2) {
                        if (err2) return log.error(err2);
                    });
                }
            }
        });
    }

    async waitTillAttributeHasValue(elm) {
        var val = '';
        await elm.getAttribute('value').then((value) => {
            val = value;
        });
        return val;
    }

    waitForSearchCriteria() {
        browser.wait(() => {
            return element(by.css('[data-ng-model=\'vm.searchCriteria\']')).isPresent();
        }, this.timeOutMedium, 'The Search Criteria was not found');
    }

    waitAndCheckAlertInfo() {
        var alertInfo = element(by.className('alert-info'));
        browser.wait(() => {
            return alertInfo.isPresent();
        }, this.timeOutHigh, 'Alert Info not present!');
        expect(alertInfo.getText()).
            toEqual('Too many results have found, please use advanced search');
    }

    countProductListItems(count) {
        expect(element.all(by.repeater('data in vm.productListItemsGridData')).count()).toEqual(count);
    }

    getMonthMapping(month) {
        var monthMapping = {
            '0': 'Jan',
            '1': 'Feb',
            '2': 'Mar',
            '3': 'Apr',
            '4': 'May',
            '5': 'Jun',
            '6': 'Jul',
            '7': 'Aug',
            '8': 'Sep',
            '9': 'Oct',
            '10': 'Nov',
            '11': 'Dec'
        };

        return monthMapping[month];
    }

    getDateTimestamp() {
        var currentDate = new Date();
        var currentHoursIn24Hour = currentDate.getHours();
        var currentTimeInHours = currentHoursIn24Hour;
        var totalDateString = currentDate.getDate()+'-'+ this.getMonthMapping(currentDate.getMonth())+
            '-'+(currentDate.getYear()+1900) +'-'+ currentTimeInHours + '-' + currentDate.getMinutes()
	    + '-' + currentDate.getSeconds();

        return totalDateString;
    }

    sendKeysOneByOne(elm, data, keyDelay=50) {
        var keys = data.split('');
        keys.forEach(function(character) {
            browser.sleep(keyDelay);
            elm.sendKeys(character);
        });
    }

    selectFromDropDown(name, dropDownElm, inputElm, keyDelay=50) {
        // method that selects item from dropdown list by enterering a name
        browser.wait(this.EC.elementToBeClickable(dropDownElm), this.timeOutLow, 'Drowpdown not clickable!').then(() => {
            dropDownElm.click();
            browser.wait(this.EC.elementToBeClickable(inputElm), this.timeOutLow, 'input not clickable!');
            this.sendKeysOneByOne(inputElm, name, keyDelay);
            inputElm.sendKeys(protractor.Key.ENTER);
        });
    }

    selectFromDropDownCustomValueSelect(name, dropDownElm, inputElm, element,keyDelay=50) {
        // method that selects item from dropdown list by enterering a name
        browser.wait(this.EC.elementToBeClickable(dropDownElm), this.timeOutLow, 'Drowpdown not clickable!').then(() => {
            dropDownElm.click();
            browser.wait(this.EC.elementToBeClickable(inputElm), this.timeOutLow, 'input not clickable!');
            this.sendKeysOneByOne(inputElm, name, keyDelay);
            element.click();
            //inputElm.sendKeys(protractor.Key.ENTER);
        });
    }

    setNotifyOnThresHold(thresHold, valuePercentage) {
        thresHold.clear().then(function() {
            thresHold.sendKeys(valuePercentage);
        });
    }

    getItemSelect(itemName, last=false) {
        var itemsLocator = element.all(by.cssContainingText('.ng-binding', itemName));
        if(last) {
            return itemsLocator.last();
        } else {
            return itemsLocator.first();
        }
    }

    verifyItemInPageTree(itemName, shoulbBePresent) {
        // This method verifies items in page tree both for published or unpublished
        if (shoulbBePresent) {
            browser.wait(this.EC.visibilityOf(this.getItemSelect(itemName)), this.timeOutLow, 'Item: '+itemName+' name not found!');
        } else {
            browser.wait(this.EC.invisibilityOf(this.getItemSelect(itemName)), this.timeOutLow, 'Item name '+itemName+' still found!');
        }
    }

    doConfirm(elm) {
        browser.wait(this.EC.visibilityOf(elm), this.timeOutLow, 'Confirmation not visible!');
        browser.wait(this.EC.elementToBeClickable(elm), this.timeOutLow, 'Confirmation not clickable!').then(() => {
            elm.click();
        });
    }

    getMonthDays(month) {
        var monthDaysMapping = {
            '1': 31,
            '2': 28,
            '3': 31,
            '4': 30,
            '5': 31,
            '6': 30,
            '7': 31,
            '8': 31,
            '9': 30,
            '10': 31,
            '11': 30,
            '12': 31
        };
        return monthDaysMapping[month];
    }

    getEndDate(addToDate) {
        /* This method adds months, days, years to actual date
         * args: addToDate: dict containing month, day, year to add e.g. {'month': 1, 'day': 1, 'year': 0}
         * return value: exactDate; new date with added months, days, years in format m/d/yyyy as needed to give exact date in Add-Ons
         */
        var nowDate = new Date();
        var month = nowDate.getMonth()+1;
        var day = nowDate.getDate();
        var year = nowDate.getFullYear();
        // for 28 till 31 days max (because of February) keep day on 28
        if(day >= 28) {
            day = 28;
        }
        // if month 12 and want to add 1 month update year and start over from 1
        if(month == 12 && addToDate['month'] == 1) {
            month = 1;
            year++;
        }
        month+=addToDate['month'];
        day+=addToDate['day'];
        var daysInMonth = this.getMonthDays(month);
        if(day > daysInMonth) {
            day = day - daysInMonth;
            month++;
            // again if month 12  and add 1 month update year and start over from 1
            if(month == 12 && addToDate['month'] == 1) {
                month = 1;
                year++;
            }
        }
        year+=addToDate['year'];
        return month+'/'+day+'/'+year;
    }

    getCurrentDate(){
        //Current date 
        var date = new Date(),
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        console.log([year, month, day].join('-'));
        return [year, month, day].join('-');       
    }

    combinedDateTimeRepresentation(utc='+01:00') {
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year+"-"+month+"-"+day+"T"+hour+":"+min+":"+sec+utc;
    }

    getUniqueNumber() {
        var date = new Date();
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year+month+day+hour+min+sec;
    }
    getSortUniqueNumber() {
        var date = new Date();
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        year = year.toString().substr(-2);
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year+month+day+sec;
    }
}

module.exports = Utils;

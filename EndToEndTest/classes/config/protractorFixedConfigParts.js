'use strict';

/* Class for fixed config parts and initialization/setup for Protractor run.
 * These parameters do not need to be changed often and are hidden for user.
 */

// Initial variables needed for instantiating Utils/Logger
global.protractor = {};

const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const HTMLReport = require('protractor-html-reporter');
const jasmineReporters = require('jasmine-reporters');
const mergeXmlResults = require('../utils/mergeXmlResults.js');
const currentPath = process.cwd();
const test_results_dir = currentPath + '/test_results';
const screenshotsDir = '/screenshots';
const fs = require('fs');
const path = require('path');
const Logger = require('../logger/logger.js');
const logger = new Logger('protractorFixedConfigParts');
const log = logger.log;
const Utils = require('../utils/Utils.js');
const utils = new Utils();

class protractorFixedConfigParts {
    constructor() {
        this.infoFile = __dirname+'/../../protractor.info' || null;
        this._init();
    }

    _init() {
        if (fs.existsSync(this.infoFile)) {
            const stats = fs.statSync(this.infoFile);
            const fleSzeBytes = stats.size;

            if(fleSzeBytes > 0) {
                var data = fs.readFileSync(this.infoFile);
                global.protractorInfo = JSON.parse(data);
            } else {
                log.info(this.infoFile+' is zero byte file, resetting');
                global.protractorInfo = {};
            }
        } else {
            log.info(this.infoFile+' does not exist yet!');
            global.protractorInfo = {};
        }

        if (!fs.existsSync(test_results_dir)) {
            log.info(test_results_dir+' does not exist yet creating it now');
            fs.mkdirSync(test_results_dir);
        }

        if (!fs.existsSync(test_results_dir+screenshotsDir)) {
            log.info(test_results_dir+screenshotsDir+' does not exist yet creating it now');
            fs.mkdirSync(test_results_dir+screenshotsDir);
        }

        var startTimestamp = utils.combinedDateTimeRepresentation();
        global.protractorInfo['testStartTime'] = startTimestamp;
        log.info('Protractor test started at: '+startTimestamp);
    }

    async cleanFilesInDir(dir) {
        if (fs.existsSync(dir)) {
            fs.readdir(dir, (err1, files) => {
                if (err1) throw err1;

                for (const file of files) {
                    var aFile = path.join(dir, file);
                    const stat = fs.lstatSync(aFile);

                    if(stat.isFile()) {
                        fs.unlinkSync(aFile, err2 => {
                            if (err2) throw err2;
                        });
                    }
                }
            });
        }
        return 0;
    }

    setJasmineOptions() {
        // Options to be passed to Jasmine-node.
        return {
            defaultTimeoutInterval: 240000,
            showColors: true, // Use colors in the command line report.
            isVerbose : true,
            includeStackTrace : true
        };
    }

    async beforeLaunch() {
        await this.cleanFilesInDir('./logs');
        await this.cleanFilesInDir(test_results_dir+screenshotsDir);
        await this.cleanFilesInDir(test_results_dir);

    }

    onPrepare() {
        jasmine.getEnv().addReporter(new SpecReporter({
            displayFailuresSummary: true,
            displayFailuredSpec: true,
            displaySuccessfulSpec: true,
            displaySuiteNumber: true,
            displaySpecDuration: true,
            displayStacktrace: 'all'
        }));

        var resultsFile = 'xmlresults' + '_' + utils.getDateTimestamp();

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidate: true,
            consolidateAll: true,
            savePath: test_results_dir,
            modifiedSuiteName: false,
            filePrefix: resultsFile,
        }));

        // create screenshots on failure
        var fsExtra = require('fs-extra');

        jasmine.getEnv().addReporter({
            specDone: function(result) {
                if (result.status == 'failed') {
                    browser.getCapabilities().then(function (caps) {
                        var browserName = caps.get('browserName');

                        browser.takeScreenshot().then(function (png) {
                            var stream = fsExtra.createWriteStream('./test_results/screenshots/' + browserName + '-' + result.fullName+ '.png');
                            stream.write(new Buffer(png, 'base64'));
                            stream.end();
                        });
                    });
                }
            }
        });
    }

    writeProtractorInfoFile() {
        var infoFile = this.infoFile;

        return new Promise(function(resolve, reject) {
            var endTimestamp = utils.combinedDateTimeRepresentation();
            log.info('Protractor test ended at: '+endTimestamp);
            global.protractorInfo['testEndTime'] = endTimestamp;

            var protractorInfoJson = JSON.stringify(protractorInfo, null, 4);
            utils.writeDataToFile(infoFile, protractorInfoJson);
        }).catch(err => {
            setTimeout(function() {
                reject('Writing protraction.info failed: '+err);
            });
        });
    }

    onComplete() {
        var merge = new mergeXmlResults(test_results_dir);
        merge.mergeXml();

        this.writeProtractorInfoFile();

        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');

            //HTMLReport called once tests are finished
            var testConfig = {
                reportTitle: 'Test End to End Test Execution Report',
                outputPath: test_results_dir,
                screenshotPath: '.'+screenshotsDir,
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: true
            };

            new HTMLReport().from(test_results_dir + '/xmlresults.xml', testConfig);
        }).catch(err => {
            setTimeout(function() {
                throw new Error('Generating HTML report failed: '+err);
            });
        });
    }
}

module.exports = protractorFixedConfigParts;


const Logger = require('../logger/logger.js');
const fs = require('fs');

class mergeXmlResults {
    constructor(test_results_dir) {
        this.logger = new Logger('mergeXmlResults');
        this.log = this.logger.log;
        this.results_dir = test_results_dir;
    }

    mergeXml() {
        this.log.debug('Merging JUnit reports...');
        var destinationFile = this.results_dir + '/xmlresults.xml';
        var testDir = this.results_dir;
        var sourceFiles = fs.readdirSync(testDir)
            .filter(function(filename) {
                return filename.match(/^xmlresults_.*.xml$/);
            })
            .map(function(filename) {
                return testDir + '/' + filename;
            });
        this.log.debug('Source JUnit report files: ', sourceFiles);
        this.log.debug('Destination JUnit report file: ', destinationFile);
        var startTag = '<testsuites ';
        var startSuiteTag = '<testsuite ';
        var startTagWritten = false;
        var endTag = '</testsuites>';
        var endSuiteTag = '</testsuite>';
        var xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>\n';
        var result = '';
        var index = 1;
        sourceFiles.forEach(function(sourcePath) {
            var contents = fs.readFileSync(sourcePath, 'utf8');
            var startIndex = contents.indexOf(startTag, 0);
            var startSuiteIndex = contents.indexOf(startSuiteTag, 0);
            var endIndex = contents.indexOf(endTag);
            var endSuiteIndex = contents.indexOf(endSuiteTag);
            var suite = '';
            if (!startTagWritten) {
                suite = contents.substring(startIndex, endIndex);
                startTagWritten = true;
            } else {
                suite = contents.substring(startSuiteIndex, endSuiteIndex);
            }
            result += suite;
            if (index > 1 && sourceFiles.length > 1) {
                result += endSuiteTag + '\n';
            }
            index++;
        });
        result = xmlHeader + result;
        result += endTag;
        fs.writeFileSync(destinationFile, result, 'utf8');
        this.log.debug('JUnit reports merged into file: ', destinationFile);
    }
}

module.exports = mergeXmlResults;


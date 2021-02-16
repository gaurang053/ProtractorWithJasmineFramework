# Protractor with Jasmine framework

Sample Application - Thuisbezorgd, This is a food delivery platform in NL. 

End to end test with Protractor ( wrapper around Selenium ) with Jasmine framework

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Checkout this project ( on linux or windows ) and following the steps below will guide you to start running the end to end tests.

The tests and resources are written in nodejs javascript

### Prerequisites

To be able to setup/install you need npm ( Node Package Manager ) and chrome installed on your machine

On Linux ( e.g. Ubuntu ):
```
sudo apt install chromium-browser
sudo ln -s /usr/bin/chromium-browser /usr/bin/chrome

sudo apt install nodejs
```

On Linux ( e.g. Redhat ):
```
sudo yum install google-chrome-stable
sudo ln -s /usr/bin/google-chrome-stable /usr/bin/chrome

sudo yum install nodejs
```

On Windows:
```
Install git: Download and install from https://git-scm.com/download/win
Install nodejs: Downoad and install .msi package from https://nodejs.org/dist/v8.11.3/node-v8.11.3-x64.msi
Install Java: Download and install from: https://java.com/en/download/win10.jsp
Install win-bash for running bash script to start webdriver: download and install from: http://win-bash.sourceforge.net/ (from the Downloads folder open shell.w32-ix86 copy the file named "bash" into C:\Program Files\Git\cmd folder
```

## Clone project from git
Clone project from git
```
go to the directory on your file system where you want to project to be checked out

git clone https://github.com/gaurang053/RestaurantApplicationsTeam.git
```
This will clone the project and create the End to End Test directory with the whole project in it.

### Installing node packages

Install the required packages with following commands from a terminal window ( for windows in cmd window )

On linux:

```
cd EndToEndTest
sudo npm install -g protractor

sudo npm install angularjs
sudo npm install jasmine
sudo npm install jasmine-spec-reporter --save-dev
sudo npm install jasmine-reporters
sudo npm install protractor-html-reporter
sudo npm install mssql
sudo npm install log4js
sudo npm install log4js-protractor-appender
sudo npm install request
sudo webdriver-manager update

webdriver-manager update
( or if a specific version is needed: sudo webdriver-manager update --versions.chrome={{version number}} )
```

On windows:pm

```
cd EndToEndTest
npm install
npm config set prefix "C:\Users\<your user name>\<workspace>\EndToEndTest"
webdriver-manager update
```

## How to Run the tests

NOTE: in case chrome or firefox and web-driver is not started have in your config file parameter: directConnect: true => not recommended on Windows
To run all tests at once:

```
protractor configs/conf_test.js
```


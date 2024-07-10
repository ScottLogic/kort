# Playwright Testing ReadMe

A small readMe on how to run the playwright suite and the commands required

## Table of Contents

* [How to set up throttle limiter for testing](#Throttler-Setup)  
* [How to run playwright](#Running-Playwright)
    * [Running all tests](#running-all-tests)  
    * [Running a single test](#running-a-single-test)
    * [Run a set of tests](#run-a-set-of-test-files)  
    * [Running tests in heeaded mode](#running-tests-in-headed-mode)
    * [Running tests on a specific browser engine](#running-tests-on-specific-browser)


## How to set up throttle limiter for testing

When building the test suite it was found that the tests would max out the rate limiter. A change was made to make this a variable which can be set to different values. 

To set this up for testing do the following:

* Make sure you have down docker compose down 
* Before building a new docker image go into `app.js` and set the `DEFAULT_RATE_LIMIT` variable to 
* Build and run a new docker image via docker-compose build and docker-compose up

This is to be done before any tests are run otherwise the limiter will max out and the tests will fail.

## How to run playwright

By default tests will be run on all 3 browsers, chromium, firefox and webkit using 3 workers. This can be configured in the `playwright.config` file. Tests are run in headless mode meaning no browser will open up when running the tests. Results of the tests and test logs will be shown in the terminal.

```
cd playwright/
```

### Running all tests:

```
npx playwright test
```

### Running a single test:

Navigate into test folder you would like to run within the playwright folder i.e /ui-tests.
```
npx playwright test file-name
```

### Run a set of test files:

```
npx playwright test ui-tests/todo-page/ ui-tests/landing-page/
```

### Running tests in headed mode:

By default tests are run in a headless manner meaning no browser window will be opened while running the tests and results will be seen in the terminal. Headed mode opens a browser window when the tests run so that the steps of the test can be viewed in real time
```
npx playwright test file-name -- --headed
```

### Running tests on a specific browser engine:

Unless specified in `playwright.config` you cannot call a specific browser engine that is not there so make sure to check that the config allows for this

```
npx playwright test file-name -- --project=chromium
```
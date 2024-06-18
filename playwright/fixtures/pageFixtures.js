const base = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { OverviewPage } = require ('../pages/overviewPage');
const { StudiesPage } = require('../pages/studiesPage');
const { EditTreeTestPage } = require('../pages/editTreeTestPage');

exports.test = base.test.extend({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    overviewPage: async ({ page }, use) => {
        const overviewPage = new OverviewPage(page);
        await use(overviewPage);
    },

    studiesPage: async ({ page }, use) => {
        const studiesPage = new StudiesPage(page);
        await use(studiesPage);
    },

    editTreeTestPage: async ({ page }, use) => {
        const editTreeTestPage = new EditTreeTestPage(page);
        await use(editTreeTestPage);
    },

});

exports.expect = base.expect;
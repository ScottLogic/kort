const base = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { OverviewPage } = require ('../pages/overviewPage');
const { StudiesPage } = require('../pages/studiesPage');
const { UsersPage } = require('../pages/usersPage');

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

    usersPage: async ({ page }, use) => {
        const usersPage = new UsersPage(page);
        await use(usersPage);
    },

});

exports.expect = base.expect;
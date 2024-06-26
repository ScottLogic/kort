const base = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { OverviewPage } = require ('../pages/overviewPage');
const { StudiesPage } = require('../pages/studiesPage');
const { EditTreeTestPage } = require('../pages/editTreeTestPage');
const { UsersPage } = require('../pages/usersPage');
const { TreeTestStudy } = require('../pages/treeTestStudy');
const { ResultsPage } = require('../pages/resultsPage');

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

    usersPage: async ({ page }, use) => {
        const usersPage = new UsersPage(page);
        await use(usersPage);
    },

    treeTestStudy: async ({ page }, use) => {
        const treeTestStudy = new TreeTestStudy(page);
        await use(treeTestStudy);
    },

    resultsPage: async ({ page }, use) => {
        const resultsPage = new ResultsPage(page);
        await use(resultsPage);
    }

});

exports.expect = base.expect;
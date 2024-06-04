import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { OverviewPage } from '../pages/overviewPage';

export const test = test.extend({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    overviewPage: async ({ page }, use) => {
        const overviewPage = new OverviewPage(page);
        await use(overviewPage);
    },

});

export const expect = expect;
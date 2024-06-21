import { test, expect } from '../fixtures/pageFixtures.js';

test.beforeEach('Login', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('admin','admin');
});

test('overview title', async ({ overviewPage }) => {
    await overviewPage.goto();
    await expect(overviewPage.header).toHaveText('Overview');
});

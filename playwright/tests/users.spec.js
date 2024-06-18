import { test, expect } from '../fixtures/pageFixtures.js';

test.beforeEach('Login', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login();
});

test('overview title', async ({ overviewPage }) => {
    await overviewPage.goto();
    await expect(overviewPage.header).toHaveText('Overview');
});

test('Add and remove a new user', async ({ overviewPage, usersPage, loginPage }) => {
    await overviewPage.users.click();
    await usersPage.newUserButton.click();
    await usersPage.addNewUser('user','user');
    await usersPage.logout.click();

    await loginPage.goto();
    await loginPage.login('user', 'user');

    await expect(overviewPage.header).toHaveText('Overview');
    await usersPage.logout.click();

    await loginPage.login();
    await overviewPage.users.click();
    await usersPage.deleteUser('user');
});

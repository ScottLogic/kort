import { test, expect } from '../fixtures/pageFixtures.js';

test.beforeEach('Login', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login();
});

test('overview title', async ({ overviewPage }) => {
    await overviewPage.goto();
    await expect(overviewPage.header).toHaveText('Overview');
});

// test('studies title', async ({ page }) => {
//     await page.goto('http://localhost:3000/studies')
//     await expect(page.locator('h1', { hasText: 'Studies' }));
// });

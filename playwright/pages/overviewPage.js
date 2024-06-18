export class OverviewPage {

    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.goToStudiesButton = page.locator("#gostudies");
        this.navbarbutton = page.locator('.navbar-toggler');
        this.navPanel = page.locator('#navbarNav');
        this.users = this.navPanel.locator('.fa-users');
        this.logout = this.navPanel.locator('.fa-sign-out');
        this.header = this.page.locator('h1', { hasText: 'Overview' });
    }

    async goto() {
        await this.page.goto('http://localhost:3000/overview');
    }

    async clickGoToStudies() {
        this.goToStudiesButton.click();
    }
}
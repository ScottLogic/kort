export class OverviewPage {

    constructor(page) {
        this.page = page;
        this.goToStudiesButton = page.locator("#gostudies");
        this.header = this.page.locator('h1', { hasText: 'Overview' });
    }

    async goto() {
        await this.page.goto('http://localhost:3000/overview');
    }

    async clickGoToStudies() {
        this.goToStudiesButton.click();
    }
}
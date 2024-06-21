export class PreviewPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.header = this.page.locator('.navbar-brand');
        this.taskNum = this.page.locator('#taskNum');
        this.taskQuestion = this.page.locator('#taskDesc');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.giveUpButton = page.getByRole('button', { name: 'Give Up' });
        this.nodeTree = page.locator('#tree');
        this.modalConfirmButton = page.getByRole('button', { name: 'Yes, Continue' });
        this.modalConfirmGiveUpButton = page.getByRole('button', { name: 'Yes, Give Up' });
        this.thankYouMessage = this.page.locator('h1', { hasText: 'Thank you.' });
    }

    async goto(url) {
        await this.page.goto(url);
    }

    async selectApple() {
        await this.nodeTree.locator('a:has-text("Fruits")').click();
        await this.nodeTree.locator('a:has-text("Apple")').click();
    }

    async selectBacon() {
        await this.nodeTree.locator('a:has-text("Meats")').click();
        await this.nodeTree.locator('a:has-text("Bacon")').click();
    }

    async nextConfirm() {
        await this.nextButton.click();
        await this.modalConfirmButton.click();
    }

    async giveUpConfirm() {
        await this.giveUpButton.click();
        await this.modalConfirmGiveUpButton.click();
    }

    async finishConfirm() {
        await this.finishButton.click();
        await this.modalConfirmButton.click();
    }

}
import { forEach } from 'async';

export class TreeTestStudy {

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
        this.giveUpButton = page.locator('#giveUpTaskButton');
        this.nodeTree = page.locator('#tree');
        this.modalConfirmButton = page.getByRole('button', { name: 'Yes, Continue' });
        this.modalConfirmGiveUpButton = page.locator('#giveUpModalButton');
        this.thankYouMessage = this.page.locator('h1', { hasText: 'Thank you.' });
    }

    async goto(url) {
        await this.page.goto(url);
    }

    async selectNode(...path) {
        for (const node of path) {
            await this.nodeTree.locator('a:has-text("'+node+'")').click();
        }
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
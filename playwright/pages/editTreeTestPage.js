export class EditTreeTestPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.header = this.page.locator('h1', { hasText: 'Edit Tree Test' });
        this.editTestTitle = page.locator('#title');
        this.newTaskButton = page.locator('#newTask');
        this.selectableParentsCheckbox = page.locator("[name='selectableParents']");
        this.showSiblingsCheckbox = page.locator("[name='showSiblings']");
        this.acceptResponses = this.page.locator('radio', { hasText: 'Accepting Responses' });
        this.notAcceptingResponses = this.page.locator('radio', { hasText: 'Not accepting Responses' });
        this.submitButton = page.locator('#submitBtn');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.taskTable = page.locator('#tasks');
        this.addChildNode = page.locator('#createNewNode');
        this.addRootNode = page.locator('#createNewRootNode');
        this.expandTableNodes = page.locator('#expandAll');
        this.nodeTree = page.locator('#tree')
    }

    async fillLastRow(questionString) {
        await this.newTaskButton.click();
        this.emptyRow = await this.taskTable.locator('textarea').last();
        this.emptyRow.fill(questionString);
    }

    async questionAnswers(rowQuestion) {
        const row = this.taskTable.locator('tr:has-text(\"'+rowQuestion+'\")');
        this.expectedAnswer.this.row('#expected-answers');
    }

    async deleteQuestions(rowQuestion) {
        const row = this.taskTable.locator('tr:has-text(\"'+rowQuestion+'\")');
        await row.getByRole('button', { name: 'deletetask' });
    }

    async deleteAnswer(rowQuestion) {
        const row = this.taskTable.locator('tr:has-text(\"'+rowQuestion+'\")');
        await this.row.locator('a:has-text("Remove")').click();
    }

    async addAnswer(rowQuestion) {
        this.emptyRow = await this.taskTable.locator('textarea').last().locator('../..');
        await this.emptyRow.locator('#newAnswer').click();
    }

    async answerText(rowQuestion) {
        this.emptyRow = await this.taskTable.locator('textarea').last().locator('../..');
        this.newAnswer = this.emptyRow.locator('p:has-text("false")');
    }

    async expandTableAndAddNodes() {
        await this.expandTableNodes.click();
        await this.addRootNode.click();
        await this.nodeTree.locator('a:has-text("Fruits")').click();
        await this.addChildNode.click();
    }
}
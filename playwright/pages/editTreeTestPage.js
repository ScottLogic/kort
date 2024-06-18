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
        this.taskTable = page.locator('#tasks')
    
    }

    async fillLastRow(questionString) {
        await this.newTaskButton.click();
        this.taskTable = this.page.locator('#tasks');
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
        const row = this.taskTable.locator('tr:has-text(\"'+rowQuestion+'\")');
        await row.locator('button:has-text("Add answer")').click();
    }
}
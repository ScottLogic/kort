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

    /*
    * The issue in here is the way kort saves the text. Because we have entered the 
    * string previously, it does not appear in the DOM until the edited test is saved.
    * 
    * Therefore we still need to find the last row and navigate from there which I have left 
    * in the code below.
    * 
    * An alternative could be to save the test and come back into it, however I 
    * don't like that as we are just needlessly hitting more pages.
    * 
    * Have a play and see what you think - this works, but it's not clean.
    *
    * */
    async addAnswer(rowQuestion) {
        //Same as you did above to get the text area, however at the end
        //I have locator('../..') which acts the same as it does in CMD, just navigates
        //back two levels. From there, I now have the tr element for the last row.
        this.emptyRow = await this.taskTable.locator('textarea').last().locator('../..');

        //Now that I have the required row, I can just locate with the button ID and click
        await this.emptyRow.locator('#newAnswer').click();
    }
}
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
        this.acceptResponses = page.getByText('Accepting responses', { exact: true });
        this.notAcceptingResponses = page.getByText('Not accepting responses', { exact: true });
        this.submitButton = page.locator('#submitBtn');
        this.taskTable = page.locator('#tasks');
        this.addChildNode = page.locator('#createNewNode');
        this.addRootNode = page.locator('#createNewRootNode');
        this.expandTableNodes = page.locator('#expandAll');
        this.nodeTree = page.locator('#tree');
        this.uniqueParticipantLinkRadioButton = page.getByText('Unique link for each participant', {exact : true});
        this.addNameForUniqueParticipant = page.getByPlaceholder('Enter participant identifier (name, id, etc.)');
        this.addUniqueParticipantButton = page.locator('#addResponseBtn');
        this.responsesTable = page.locator('#responses_table_body');
    }

    async fillLastRow(questionString) {
        await this.newTaskButton.click();
        this.emptyRow = await this.taskTable.locator('textarea').last();
        this.emptyRow.fill(questionString);
    }

    async deleteQuestions(rowQuestion) {
        const row = this.taskTable.locator('tr:has-text(\"'+rowQuestion+'\")');
        await row.getByRole('button', { name: 'deletetask' });
    }

    async deleteAnswer(rowQuestion) {
        const row = this.taskTable.locator('tr:has-text(\"'+rowQuestion+'\")');
        await row.locator('a:has-text("Remove")').click();
    }

    async clickAddAnswerButton() {
        this.emptyRow = this.taskTable.locator('textarea').last().locator('../..');
        await this.emptyRow.locator('#newAnswer').click();
    }

    async answerText(rowQuestion) {
        this.emptyRow = this.taskTable.locator('textarea:has-text(\"'+rowQuestion+'\")').locator('../..');
        this.newAnswer = this.emptyRow.locator('p:has-text("false")');
    }

    async expandTableAndAddNodes() {
        await this.expandTableNodes.click();
        await this.addRootNode.click();
        await this.nodeTree.locator('a:has-text("Fruits")').click();
        await this.addChildNode.click();
    }

    async copyUniqueLink(participantName) {
        this.row = this.responsesTable.locator('td:has-text(\"'+participantName+'\")').locator('..');
        return this.row.locator('a:has-text("treetest")').textContent();
    }

    async changeTestTitle(title) {    
        await this.editTestTitle.clear();
        await this.editTestTitle.fill(title);
        await this.submitButton.click();
    }
    async addParticipantName(name) {
        await this.addNameForUniqueParticipant.isVisible();
        await this.addNameForUniqueParticipant.clear();
        await this.addNameForUniqueParticipant.fill(name);
        await this.addUniqueParticipantButton.click();
    }
}
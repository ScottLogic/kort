export class EditTreeTestPage {

    constructor(page) {
        this.page = page;
        this.editTestTitle = page.locator('#title');
        this.newTaskButton = page.locator('#newTask');
        this.selectableParentsCheckbox = page.locator("[name='selectableParents']");
        this.showSiblingsCheckbox = page.locator("[name='showSiblings']");
        this.submitButton = page.locator('#submitBtn');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }
}
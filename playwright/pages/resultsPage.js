export class ResultsPage {

    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.responseCounter = this.page.locator('#responsesNum');
        this.responseTable = this.page.locator('#results_table_body');
        this.dataByResponseTable = this.page.locator('#treetest_results_table');
        this.treeTestTable = this.page.locator('#treetest_table');
    }

    async headerText(treeTestName) {
        this.header = this.page.locator('h1', { hasText: 'Results for '+treeTestName+'' });
    }

    async responses(name) {
        this.nameCell = this.responseTable.locator('td:has-text(\"'+name+'\")').locator('..');
    }

    async dataByResponse(name, task1, task2){
        this.dataNameCell = this.dataByResponseTable.locator('td:has-text(\"'+name+'\")').locator('..');
        this.task1Cell = this.dataNameCell.locator('td:has-text(\"'+task1+'\")');
        this.task2Cell = this.dataNameCell.locator('td:has-text(\"'+task2+'\")');    }

    async responsesByTask(task){
        this.taskCell = this.treeTestTable.locator('td:has-text(\"'+task+'\")', {exact: true}).locator('..');
    }
}
export class StudiesPage {

    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.header = this.page.locator('h1', { hasText: 'Studies' });
        this.newStudiesButton = this.page.locator('#newstudy');
        this.studiesTable = this.page.locator('#studies_table');
        this.modalConfirmDelete = page.getByRole('button', { name: 'Delete Study' });
        this.modalCancelDelete = page.getByRole('button', { name: 'Cancel' });
    }

    async goto() {
        await this.page.goto('http://localhost:3000/studies');
    }

    async clickNewStudy() {
        this.newStudiesButton.click();
        this.newStudiesDropdown = this.page.locator('.dropdown-menu');
        await this.newStudiesDropdown.getByText('Tree Test').click();
    }

    async firstRow() {
        this.fr = this.studiesTable.locator('.odd highlight-first-row');
    }

    //Review if needed - leaving for now due to potential tests
    async namedRow(rowName) {
        const row = this.page.locator('td:has-text(\"'+rowName+'\")').locator('..');
        await row.locator('a:has-text("Edit")').click();    
    }

    async clickEditButtonForFirstTableRow(rowName = null) {
        this.clickStudyRowButton('Edit', rowName);  
    }

    async clickPreviewButtonForFirstTableRow(rowName = null) {
        this.clickStudyRowButton('Preview', rowName);    
    }

    async clickResultsButtonForFirstTableRow(rowName = null) {
        this.clickStudyRowButton('Results', rowName);    
    }

    async clickStudyRowButton(button, rowName) {
        this.studiesTableBody = this.studiesTable.locator('#studies_table_body');
        if (rowName == null)
        {
            this.fr = this.studiesTableBody.locator('.highlight-first-row');  
        }
        else
        {
            this.fr = this.studiesTableBody.locator('td:has-text(\"'+rowName+'\")').locator('..');
        }
        await this.fr.getByText(button).click(); 
    }

    async deleteStudy(rowName) {
        this.clickStudyRowButton('Options' , rowName);
 
        this.studyDropdownOptions = this.page.locator('.dropdown-menu');
        await this.studyDropdownOptions.getByText('Delete', {exact : true}).click();
        await this.modalConfirmDelete.click();
    }
}
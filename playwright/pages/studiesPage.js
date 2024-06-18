export class StudiesPage {

    constructor(page) {
        this.page = page;
        this.header = this.page.locator('h1', { hasText: 'Studies' });
        this.newStudiesButton = this.page.locator('#newstudy');
        this.studiesTable = this.page.locator('#studies_table')
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
        this.fr = this.studiesTable.locator('.odd highlight-first-row')
    }

    async namedRow(rowName) {
        const row = this.page.locator('tr:has-text(\"'+rowName+'\")');
        await row.locator('a:has-text("Edit")').click();    
    }

    async clickEditButtonForFirstTableRow() {
        this.studiesTableBody = this.studiesTable.locator('#studies_table_body');
        this.fr = this.studiesTableBody.locator('.highlight-first-row');
        await this.fr.getByText('Edit').click(); 
    }

    async clickPreviewButton() {
        this.studiesTableBody = this.studiesTable.locator('#studies_table_body');
        this.fr = this.studiesTableBody.locator('.highlight-first-row');
        await this.fr.getByText('Preview').click(); 

    }

    async clickResultsButton() {
        this.studiesTableBody = this.studiesTable.locator('#studies_table_body');
        this.fr = this.studiesTableBody.locator('.highlight-first-row');
        await this.fr.getByText('Results').click(); 

    }
}
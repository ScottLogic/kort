export class StudiesPage {

    constructor(page) {
        this.page = page;
        this.goToStudiesButton = page.locator("#newstudy");
        this.newStudiesDropdown = page.locator('.dropdown-menu');

    }

    async goto() {
        await this.page.goto('http://localhost:3000/studies');
    }

    async clickNewStudy() {
        this.goToStudiesButton.click();
    }

    async selectNewStudy(study) {
        this.newStudiesDropdown.getByText(study).click();
    }

}
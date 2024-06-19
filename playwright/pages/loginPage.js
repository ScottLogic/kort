export class LoginPage {

    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page;
        this.username = this.page.getByPlaceholder('Email');
        this.password = this.page.getByPlaceholder('Password');
        this.loginButton = this.page.getByRole('button');
    }

    async goto() {
        //TODO: Remove timeout once Kort throttling is fixed
        await this.page.waitForTimeout(2000);
        await this.page.goto('http://localhost:3000/');
    }

    async login() {
        await this.username.fill('admin');
        await this.password.fill('admin');
        await this.loginButton.click();
    }

}
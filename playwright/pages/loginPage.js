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

        await this.page.goto('/');
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

}
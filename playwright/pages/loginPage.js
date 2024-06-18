export class LoginPage {

    constructor(page) {
        this.page = page;
        this.username = this.page.getByPlaceholder('Email');
        this.password = this.page.getByPlaceholder('Password');
        this.loginButton = this.page.getByRole('button');
        this.siteSubtitle = this.page.locator('#siteSubtitle');
    }

    async goto() {
        await this.page.waitForTimeout(3000);
        await this.page.goto('http://localhost:3000/');
    }

    async login(username='admin', passowrd='admin') {
        await this.username.fill(username);
        await this.password.fill(passowrd);
        await this.loginButton.click();
    }

}
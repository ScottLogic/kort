import { timeout } from "async";

export class UsersPage {

   /**
    * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        this.page = page;
        this.newUserButton = page.locator('#newUserBtn');    
        this.usersTable = page.locator('#userstable');
        this.navbarbutton = page.locator('.navbar-toggler');
        this.navPanel = page.locator('#navbarNav');
        this.logout = this.navPanel.locator('.fa-sign-out');
    }

    async addNewUser(username, password) {
        
        //These fields appear as a pop up 
        this.newUserForm = this.page.locator('#newUserForm');
        this.emailField = this.newUserForm.locator('#email');
        this.passwordField = this.newUserForm.locator('#password');
        this.addNewUserButton = this.newUserForm.locator('button:text("Add User")');
    
        await this.emailField.fill(username);
        await this.passwordField.fill(password);

        //TODO: Remove timeouts when kort throttling is resolved
        await this.page.waitForTimeout(2000);
        await this.page.locator('button:text("Add User")').click();
        //TODO:Remove timeout when kort throttling is resolved
        await this.page.waitForTimeout(2000);
    }

    async deleteUser(username) {
        const row = this.page.locator('tr:has-text(\''+username+'\')');  
        await row.locator('a:has-text("Delete")').click();

        //Confirmation pop up
        await this.page.locator('button:text("Delete User")').click();
    }
}
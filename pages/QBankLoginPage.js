import testData from '../fixtures/json_testData.json';
import { expect } from '@playwright/test';

export class QBankLoginPage {
    constructor(page) {
        this.page = page;
        this.url = testData.url;
        this.usernameField = this.page.getByPlaceholder('Username');
        this.passwordField = this.page.getByPlaceholder('Password');
        this.signInButton = this.page.getByRole('button', { name: 'Sign In' });
    }

    async gotoLoginPage() {
        await this.page.goto(this.url);
        await expect(this.page.getByText('Welcome back!')).toBeVisible();
    }

    async login(username = testData.username, password = testData.password) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.signInButton.click();
    }
}
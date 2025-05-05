import { expect } from '@playwright/test';
export class QBankDashboardPage {
    constructor(page) {
        this.page = page;
    }

    async verifyUser(expectedUser) {
        await this.page.locator("//div[text()='Salary Account']").waitFor();
        await expect(this.page.getByRole('link', { name: expectedUser })).toBeVisible();
    }

    async getAccountBalance(accountName) {
        const balanceText = await this.page.locator(`//div[text()='${accountName}']/../..//div[contains(@class,'qb-account-balance')]`).textContent();
        return this.strToNum(balanceText);
    }

    async verifyTransaction(transactionID, debitedAmount) {
        await this.page.getByText('Account Activity').click();
        await this.page.locator("//td[@id='qba-transaction-content']").nth(0).waitFor();
        const transactions = this.page.locator("//td[@id='qba-transaction-content']");
        const count = await transactions.count();
        for (let i = 0; i < count; i++) {
            const transaction = await transactions.nth(i).textContent();
            if (transaction.trim() === transactionID) {
                console.log('Transaction Successful of Amount $' + debitedAmount);
                return true;
            }
        }
        return false;
    }

    async logout() {
        await this.page.getByText('Log out').click();
    }

    strToNum(string) {
        let amount = string.replace('$', '').replaceAll(',', '').split('.');
        return parseInt(amount[0]);
    }
}
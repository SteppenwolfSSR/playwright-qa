import { expect } from '@playwright/test';
export class QBankTransactionPage {
    constructor(page) {
        this.page = page;
    }

    async makeTransfer(fromAccount, toAccount, amount, memo) {
        await this.page.getByText('Make a Transfer').click();
        await expect(this.page.locator(".qbf-box-heading")).toContainText('Transfer Funds');
        await this.page.getByRole('combobox', { name: 'Transfer from' }).selectOption(fromAccount);
        await this.page.getByRole('combobox', { name: 'Transfer to' }).selectOption(toAccount);
        await this.page.getByLabel('Amount ($)').fill(amount.toString());
        await this.page.getByLabel('Memo').fill(memo);
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.page.locator("//span[contains(@class,'transaction-amoun')]").waitFor();
    }

    async getTransactionID() {
        const transactionDetails = await this.page.locator("//span[contains(@class,'transaction-amoun')]").getAttribute('data-transaction');
        return transactionDetails.split('-')[1];
    }
}
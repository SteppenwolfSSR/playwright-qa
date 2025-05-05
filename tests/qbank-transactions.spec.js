import { test, expect } from '@playwright/test';
import { QBankLoginPage } from '../pages/QBankLoginPage';
import { QBankDashboardPage } from '../pages/QBankDashboardPage';
import { QBankTransactionPage } from '../pages/QBankTransactionPage';

test.describe('QBANK', async () => {

    test('Qbank_Transaction_Validation', async ({ page }) => {
        const loginPage = new QBankLoginPage(page);
        const dashboardPage = new QBankDashboardPage(page);
        const transactionPage = new QBankTransactionPage(page);

        // Launch Qbank URL and login
        await loginPage.gotoLoginPage();
        await loginPage.login();

        // Verify user and get account balance before transaction
        await dashboardPage.verifyUser('Thomas');
        const beforeBalance = await dashboardPage.getAccountBalance('Salary Account');
        console.log('Account balance before transaction => ' + beforeBalance);

        // Perform transaction
        await transactionPage.makeTransfer('Salary Account', 'Electricity Bill', 1, 'Electricity Bill');
        const transactionID = await transactionPage.getTransactionID();
        console.log('Transaction ID => ' + transactionID);
        await page.getByRole('button', { name: 'Go to Account Summary' }).click();

        // Verify account balance after transaction
        const afterBalance = await dashboardPage.getAccountBalance('Salary Account');
        console.log('Account balance after transaction => ' + afterBalance);
        expect(afterBalance, 'Verify Salary Account balance is changed').toBeLessThan(beforeBalance);

        // Verify transaction in account activity
        const transactionFound = await dashboardPage.verifyTransaction(transactionID, beforeBalance - afterBalance);
        if (!transactionFound) {
            console.log('Transaction Failed');
        }

        // Logout
        await dashboardPage.logout();
    });

});
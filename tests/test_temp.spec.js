
const { test, expect } = require('@playwright/test');
const testdata = require('../TestData/json_testData.json');

test.describe('QBANK', async () => {

    test('Qbank_Transaction_Validation', async ({ page }, testInfo) => {
        // Launch Qbank URL
        await page.goto(testdata.url);
        expect(page.locator("//div[contains(text(),'Welcome back!')]"), 'Verify Qbank Welcome text')
            .toBeVisible();

        //Login to Qbank Website
        await page.getByPlaceholder('Username').fill(testdata.username);
        await page.getByPlaceholder('Password').fill(testdata.password);
        await page.getByRole('button', { name: 'Sign In' }).click();

        //Sync
        await page.locator("//div[text()='Salary Account']").waitFor();
        // Verify User Thomas
        expect(page.getByRole('link', { name: 'Thomas' }),'Verify User Thomas').toBeVisible();

        // Get Salary account balance before transactrion
        let AccountBalance = await page.locator("//div[text()='Salary Account']/../..//div[contains(@class,'qb-account-balance')]").textContent();
        let BeforeBalance = StrtoNum(AccountBalance);
        console.log('Account balance before transaction => ' + AccountBalance);

        //Pay Electricity Bill from Salary account
        await page.getByText('Make a Transfer').click();
        expect(page.locator(".qbf-box-heading")).toContainText('Transfer Funds');
        await page.getByRole('combobox', { name: 'Transfer from' }).selectOption('Salary Account');
        await page.getByRole('combobox', { name: 'Transfer to' }).selectOption('Electricity Bill');
        await page.getByLabel('Amount ($)').fill('1');
        await page.getByLabel('Memo').fill('Elecricity Bill');
        await page.getByRole('button', { name: 'Submit' }).click();

        //sync
        await page.locator("//span[contains(@class,'transaction-amoun')]").waitFor();

        //Get Transaction details like Transaction ID
        let transactionDetails = await page.locator("//span[contains(@class,'transaction-amoun')]").getAttribute('data-transaction');
        let transactionID = transactionDetails.split('-')[1];
        console.log('Transacation ID => ' + transactionID);

        //Navigate to Account summary and get the Salary account Balance after Transaction
        await page.getByRole('button', { name: 'Go to Account Summary' }).click();
        await page.waitForSelector("//div[text()='Salary Account']");
        let BalanceAfter = await page.locator("//div[text()='Salary Account']/../..//div[contains(@class,'qb-account-balance')]").textContent();
        let AfetrBalance = StrtoNum(BalanceAfter);
        console.log('Account balance after transaction => ' + BalanceAfter);

        //Verify Amount is deducted from salary account
        expect(AfetrBalance,'Verify Salary Account balance is changed').toBeLessThan(BeforeBalance);

        //Navigate to Account activity and verify transaction by verifying Transaction ID
        await page.getByText('Account Activity').click();
        await page.locator("//td[@id='qba-transaction-content']").nth(0).waitFor();
        let trnsactions = page.locator("//td[@id='qba-transaction-content']");
        let count = await trnsactions.count();
        let debitedAmount = BeforeBalance - AfetrBalance;
        for (let i = 0; i < count; i++) {
            let trnsaction = await trnsactions.nth(i).textContent();
            if (trnsaction.trim() == transactionID) {
                console.log('Transaction Successfull of Amount $' + debitedAmount);
                break;
            }
            else if (i >= count) {
                console.log('Transaction Failed');
            }
        }

        // logout of QBank application
        await page.getByText('Log out').click()
    });
})

// Function to convert Amount String to Amount
function StrtoNum(String) {
    let Amount = String.replace('$', '');
    Amount = Amount.replaceAll(',', '');
    Amount = Amount.split('.');
    return parseInt(Amount[0]);
}

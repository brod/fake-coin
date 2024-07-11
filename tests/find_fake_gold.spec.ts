import { test } from '@playwright/test';
import { GoldCoins, HomePage } from '../pages/home_page';

let goldCoins: GoldCoins = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

test.describe('Find Fake Gold Game', async () => {
    let homePage: HomePage;

    test.beforeAll(async ({ browser }) => {
        // Create a new browser context and page, then initialize HomePage
        const context = await browser.newContext();
        const page = await context.newPage();
        homePage = new HomePage(page);
    });

    test('successfully locate the fake coin', async () => {
        // Navigate to the home page
        await homePage.navigateToHomePage();
        
        // Find the fake gold coin
        const fakeCoin = await homePage.findFakeGoldCoin(goldCoins);

        // Click on the fake coin and get the dialog message
        const result = await homePage.clickCoinValue(fakeCoin!);

        // Get the list of weighings
        const weighingResults = await homePage.getWeighingsResult();

        // Output the results
        console.log(`${result}. The fake coin is ${fakeCoin}`);
        console.log(`Number of Weighings: ${weighingResults.length} times`);
        console.log(`List of Weighings: ${weighingResults}`);
    });
});
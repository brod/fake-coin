import { Page } from "playwright";
import { Locator, expect } from "playwright/test";

type Coin = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type GoldCoins = Coin[];

export class HomePage {
    page: Page;
    readonly weighButtonId: Locator;
    readonly resetButtonId: Locator;
    readonly leftRow0: Locator;
    readonly rightRow0: Locator;
    readonly weighingResult: Locator;
    readonly weighingResultItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.resetButtonId = page.locator('#reset');
        this.weighButtonId = page.locator('#weigh');
        this.leftRow0 = page.locator('#left_0');
        this.rightRow0 = page.locator('#right_0');
        this.weighingResult = page.locator('.game-info');
        this.weighingResultItems = this.weighingResult.locator('li');
    }

    /**
     * Navigate to the home page of the application.
     * Verifies that the page title is 'React App' upon navigation.
     */
    async navigateToHomePage() {
        await this.page.goto('http://sdetchallenge.fetch.com/');
        expect(await this.page.title()).toEqual('React App');
    }

    /**
     * Find the fake gold coin among the provided coins using a specific algorithm.
     * @param coins Array of gold coin identifiers.
     * @returns The identifier of the fake gold coin found, or null if none is found.
     */
    async findFakeGoldCoin(coins: GoldCoins) {
        const firstCoin = coins[0];
        let fakeCoin: string | null = null;

        await this.leftRow0.fill(firstCoin);

        for (let i = 1; i < coins.length; i++) {
            await this.rightRow0.fill(coins[i]);
            await this.weighButtonId.click();

            const latestWeighing = await this.waitForWeighingResultUpdate();

            // Check if last weighing is different
            let lastWeighing = latestWeighing[latestWeighing.length - 1];

            // Check if lastWeighing is not the same, if not then get the lesser value
            if (lastWeighing && await this.notTheSame(lastWeighing)) {
                const lesserValue = await this.getLesserValue(lastWeighing);
                fakeCoin = lesserValue;
                break;
            }
        }

        return fakeCoin;
    }

    /**
     * This function waits for the weighing results to be updated by retrying
     * multiple times with a specified timeout between retries.
     * @param maxRetries - The maximum number of retries.
     * @param timeout - The timeout in milliseconds between retries.
     * @returns An array of weighing result strings.
     */
    async waitForWeighingResultUpdate(maxRetries = 5, timeout = 2000): Promise<string[]> {
        let currentWeightResult = await this.getWeighingsResult();
        let latestWeighing: string[] = currentWeightResult;

        for (let retry = 0; retry < maxRetries; retry++) {
            latestWeighing = await this.getWeighingsResult();

            if (latestWeighing.length > currentWeightResult.length) {
                break; // Exit loop if weighing has been updated
            }
            await this.page.waitForTimeout(timeout); // Wait before retrying
        }

        return latestWeighing;
    }

    /**
     * Retrieve the list of all weighings results as strings from the page.
     * @returns Array of strings representing the weighing results.
     */
    async getWeighingsResult(): Promise < string[] > {
        const result = await this.weighingResult.locator('li').allTextContents()
        return result
    }

    // Check if the weighing does not contain '='
    async notTheSame(weighing: string): Promise < boolean > {
        return !weighing.includes('=');
    }

    /**
     * Extract the lesser value from a comparison string of the format '[x] > [y]'.
     * @param comparisonString The string containing the comparison of two values.
     * @returns The lesser value extracted from the comparison string.
     */
    async getLesserValue(comparisonString) {
        const match = comparisonString.match(/\[(\d+)\]\s*>\s*\[(\d+)\]/);
        return match ? match[2] : '0';
    }

    /**
     * Click on a specific coin element identified by its number and return the dialog message.
     * @param coinNumber The identifier of the coin element to click.
     * @returns The message from the dialog that appears after clicking the coin.
     */
    async clickCoinValue(coinNumber: string): Promise < string > {
        let dialogMessage = '';

        this.page.on('dialog', async (dialog) => {
            dialogMessage = dialog.message();
            await dialog.accept();
        });

        await this.page.locator(`#coin_${coinNumber}`).click();

        return dialogMessage;
    }
}
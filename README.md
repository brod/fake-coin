# Fake Gold Coin Finder

This project is an automated test suite designed to solve the "Fake Gold Coin" challenge using Playwright. The goal is to locate the fake coin among a set of gold coins by weighing them.

## Project Structure

- `pages/`: Contains the page object model (POM) files.
  - `home_page.ts`: Includes methods to interact with the web page and find the fake gold coin.
- `tests/`: Contains the test files.
  - `find_fake_gold.spec.ts`: Test file that describes and executes the test to find the fake gold coin.
- `package.json`: Project dependencies and scripts.

Before you can run the program, make sure you have the following dependencies installed:

- **Node.js** (>= 18.15.0): You can install Node.js by visiting the [official Node.js website](https://nodejs.org/) and downloading the latest LTS version.
  
- **TypeScript** (>= 5.2.2): TypeScript can be installed globally using npm:

  ```bash
  npm install -g typescript
## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/brod/fake-gold-coin-finder.git
   cd fake-gold-coin-finder
2. Install dependencies:
    ```bash
    npm install
3. Running Tests
To run the tests, use the following command:
    ```bash
    npm run test

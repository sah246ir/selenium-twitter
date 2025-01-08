"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSelenium = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const firefox_1 = require("selenium-webdriver/firefox");
// Define function to get elements inside the timeline
function getFromQuery() {
    return document.querySelectorAll("div[aria-label='Timeline: Trending now'] div[role='link']");
}
const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_USERNAME = process.env.PROXY_USERNAME;
const PROXY_PASSWORD = process.env.PROXY_PASSWORD; // Replace with your ProxyMesh password
const proxyString = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}`;
const runSelenium = async () => {
    const options = new firefox_1.Options();
    // options.addArguments("--headless");
    // options.addArguments("--no-sandbox");
    // options.addArguments("--window-size=1920,1080");
    // options.addArguments(`--proxy-pac-url=${PAC_URL}`);
    // options.addArguments("--proxy-server="+proxyString);
    // options.setPreference("network.proxy.type", 1)
    // options.setPreference("network.proxy.http", ""+proxyString)
    // options.setPreference("network.proxy.http_port", "31280")
    // options.setPreference("network.proxy.ssl", ""+proxyString) 
    // options.setPreference("network.proxy.ssl_port", 31280) 
    options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");
    let driver = await new selenium_webdriver_1.Builder()
        .forBrowser(selenium_webdriver_1.Browser.FIREFOX)
        .setFirefoxOptions(options)
        .build();
    try {
        // Log into X account 
        // await driver.get('http://ip-api.com/json');
        // await driver.sleep(4000);
        await driver.get('https://x.com/i/flow/login');
        // Wait until the username input field is present and interact with it
        const usernameInput = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//input[@name='text']")), 10000 // Timeout in milliseconds
        );
        await usernameInput.click();
        await usernameInput.sendKeys(process.env.X_USERNAME || "");
        const nextButton = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//span[contains(text(),'Next')]")), 10000);
        await driver.wait(selenium_webdriver_1.until.elementIsVisible(nextButton), 10000);
        await nextButton.click();
        const passwordInput = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//input[@name='password']")), 10000);
        await passwordInput.click();
        await passwordInput.sendKeys(process.env.X_PASSWORD || "");
        const loginButton = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//span[contains(text(),'Log in')]")), 10000);
        await driver.wait(selenium_webdriver_1.until.elementIsVisible(loginButton), 10000);
        await loginButton.click();
        // Wait for trends to load
        const container = await driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("div[aria-label='Timeline: Trending now']")), 10000);
        await driver.wait(selenium_webdriver_1.until.elementIsVisible(container), 10000);
        const trends = await driver.findElements(selenium_webdriver_1.By.css("div[aria-label='Timeline: Trending now'] div[role='link']"));
        console.log(`Found ${trends.length} trends.`);
        // Create trendlist
        let i = 0;
        const trendlist = [];
        for (let trend of trends) {
            try {
                let ot;
                if (i == 0) {
                    ot = await trend.findElement(selenium_webdriver_1.By.css("span"));
                }
                else {
                    ot = await trend.findElement(selenium_webdriver_1.By.css("span[dir='ltr']"));
                }
                const txt = await ot.getText();
                console.log(txt);
                trendlist.push(txt);
                i += 1;
                await driver.sleep(400);
            }
            catch (err) {
            }
        }
        return trendlist;
    }
    finally {
        await driver.quit();
    }
};
exports.runSelenium = runSelenium;

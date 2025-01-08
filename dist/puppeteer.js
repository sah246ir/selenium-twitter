"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPuppeteer = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
let proxyURL = '44.219.175.186:80';
const runPuppeteer = async () => {
    const browser = await puppeteer_1.default.launch({
        browserURL: 'firefox',
        headless: false,
        dumpio: true,
        args: [
            // Add arguments to reduce internal warnings
            '--disable-infobars',
            '--no-sandbox',
            `--proxy-server=${process.env.PROXY_HOST}`,
            '--disable-setuid-sandbox'
        ],
        extraPrefsFirefox: {
            // Reduce logging from Firefox itself
            'remote.log.level': 'Info',
        },
        timeout: 60000
    });
    const page = await browser.newPage();
    await page.authenticate({
        username: process.env.PROXY_USERNAME || "",
        password: process.env.PROXY_PASSWORD || "",
    });
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    // Set a user-agent to avoid detection
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");
    try {
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const blockedResources = ['image', 'media', 'stylesheet', 'font'];
            if (blockedResources.includes(req.resourceType())) {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        // Navigate to the login page
        const ip = await page.goto("https://myexternalip.com/raw", { waitUntil: "networkidle2", timeout: 610000 });
        console.log("Proxy IP:", await page.evaluate(() => document.body.innerText.trim()));
        await page.goto("https://x.com/i/flow/login", { waitUntil: "networkidle2", timeout: 610000 });
        // Wait for the username input field and enter username
        await page.waitForSelector("input[name='text']", { timeout: 210000 });
        const sus = await page.locator("::-p-xpath(//span[contains(text(),'There was unusual login activity on your account.')])");
        if (sus) {
            await page.type("input[name='text']", process.env.X_MAIL || "");
            const nextButton1 = await page.locator("::-p-xpath(//span[contains(text(),'Next')])");
            if (nextButton1) {
                await nextButton1.click();
            }
        }
        await page.waitForSelector("input[name='text']", { timeout: 210000 });
        await page.type("input[name='text']", process.env.X_USERNAME || "");
        const nextButton = await page.locator("::-p-xpath(//span[contains(text(),'Next')])");
        if (nextButton) {
            await nextButton.click();
        }
        // Wait for the password input field
        await page.waitForSelector("input[name='password']", { timeout: 210000 });
        await page.type("input[name='password']", process.env.X_PASSWORD || "");
        const loginButton = await page.locator("::-p-xpath(//span[contains(text(),'Log in')])");
        if (loginButton) {
            await loginButton.click();
        }
        await page.waitForSelector("div[aria-label='Timeline: Trending now'] div[role='link']", { timeout: 215000 });
        // Extract trends
        const trends = await page.$$("div[aria-label='Timeline: Trending now'] div[role='link']");
        let i = 0;
        const trendlist = [];
        for (let trend of trends) {
            if (i == 0) {
                const trendHTML = await trend.evaluate(el => el?.querySelector("span")?.innerHTML.trim());
                trendlist.push(trendHTML || "");
            }
            else {
                const trendHTML = await trend.evaluate(el => el?.querySelector("span[dir='ltr']")?.innerHTML.trim());
                trendlist.push(trendHTML || "");
            }
            i += 1;
        }
        console.log(`Trends found: ${trends.length}`);
        return { trends: trendlist, ip };
    }
    catch (error) {
        console.error("Error scraping trends:", error);
        return undefined;
    }
    finally {
        await browser.close();
        ``;
    }
};
exports.runPuppeteer = runPuppeteer;

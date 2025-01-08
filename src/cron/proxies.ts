import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox";


async function getFreeProxies() {
    const options = new Options();
    options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    options.addArguments("--window-size=1920,1080");

    // options.addArguments(`--proxy-pac-url=${PAC_URL}`);
    // options.addArguments("--proxy-server="+proxyString);
    // options.setPreference("network.proxy.type", 1)
    // options.setPreference("network.proxy.http", ""+proxyString) 
    options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

    let driver = await new Builder()
        .forBrowser(Browser.FIREFOX)
        .setFirefoxOptions(options)
        .build();
    await driver.get("https://sslproxies.org");

    // Locate the table and its header and body
    const table = await driver.findElement(By.tagName("table"));
    const thead = await table.findElement(By.tagName("thead"));
    const headerElements = await thead.findElements(By.tagName("th"));
    const tbody = await table.findElement(By.tagName("tbody"));
    const rowElements = await tbody.findElements(By.tagName("tr"));

    // Extract headers
    const headers = [];
    for (const th of headerElements) {
        headers.push(await th.getText());
    }

    // Extract proxies
    const proxies = [];
    for (const tr of rowElements) {
        const proxyData:any = {};
        const tdElements = await tr.findElements(By.tagName("td"));
        for (let i = 0; i < headers.length; i++) {
            proxyData[headers[i]] = await tdElements[i].getText();
        }
        proxies.push(proxyData);
    }

    return proxies;
}
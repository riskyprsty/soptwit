import puppeteer from 'puppeteer-extra';
import fs from 'fs/promises';
// import sample from './sample.js';
import 'dotenv/config';

let loginPage = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--force-device-scale-factor'],
      devtools: false,
    });
    console.log(process.env.USERNAME_TWIT);
    // const pages = await browser.pages();
    // const page = pages[0];
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    const desiredWidth = 375;
    const desiredHeight = 667;
    const sf = 1;

    await page.setViewport({
      width: parseInt(desiredWidth / sf),
      height: parseInt(desiredHeight / sf),
      deviceScaleFactor: sf,
    });

    // const m = puppeteer.devices['iPhone X'];
    // await page.emulate(m);

    await page.goto('https://twitter.com/i/flow/login');

    // delay func
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }

    //   await delay(20000);
    let joss = await page.waitForSelector('input[autocomplete="username"]', {
      timeout: 150000,
    });
    console.log(joss);
    await page.type(
      'input[autocomplete="username"]',
      process.env.USERNAME_TWIT,
      {
        delay: 100,
      },
    );

    await page.keyboard.press('Enter');

    await page.waitForSelector('input[autocomplete="current-password"]', {
      timeout: 30000,
    });
    await page.type(
      'input[autocomplete="current-password"]',
      process.env.PASSWORD,
      {
        delay: 100,
      },
    );
    await page.keyboard.press('Enter');

    await page.waitForSelector(
      'div[data-testid="UserAvatar-Container-unknown"]',
      {timeout: 240000},
    );
    await page.click('div[data-testid="UserAvatar-Container-unknown"]');

    const cookies = await page.cookies();
    await fs.writeFile('./cookies2.json', JSON.stringify(cookies, null, 2));
    console.log('Cookies telah berhasil tersimpan');

    await browser.close();
  } catch (err) {
    console.error(`ERROR in get Cookies twitter :${err}`);
  }
};
loginPage();

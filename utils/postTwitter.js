import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import {getFiles} from './format.js';
import axios from 'axios';
import {trendJoin} from './trendsxs.js';

let loginCookies = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--force-device-scale-factor', '--start-maximized'],
    devtools: false,
  });
  const pages = await browser.pages();
  const page = pages[0];
  await page.setDefaultNavigationTimeout(0);
  const desiredWidth = 1920;
  const desiredHeight = 1080;
  const sf = 1;

  await page.setViewport({
    width: parseInt(desiredWidth / sf),
    height: parseInt(desiredHeight / sf),
    deviceScaleFactor: sf,
  });

  const cookiesString = fs.readFileSync(path.resolve('./cookies2.json'));
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  await page.goto('https://twitter.com/home?lang=id');

  // delay func
  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  //get trending
  const finaljson = JSON.parse(fs.readFileSync('./finaljson/result.json'));
  const trend = await trendJoin();
  //type
  await page.waitForSelector(
    'div.DraftEditor-editorContainer > div > div > div > div',
    {timeout: 15000},
  );
  const typing = await page.$(
    'div.DraftEditor-editorContainer > div > div > div > div',
  );
  const akhir =
    'REKOMENDASI PRODUK KECANTIKAN😍😍😍\n' +
    finaljson.map(
      (value, key) =>
        `${key + 1} Link : ${value.product_link}\n
  `,
    );
  akhir += trend;
  await typing.click();
  await typing.type(akhir, {delay: 120});
  console.log('done');

  //upload
  const files = await getFiles('./img');
  const UploadElement = await page.$('input[type="file"]');
  await page.waitForSelector('input[type=file]');

  await UploadElement.uploadFile(...files);
};

loginCookies();

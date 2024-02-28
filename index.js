import puppeteer from 'puppeteer-extra';
import fs from 'fs';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import watch from 'node-watch';
import {csvformatter} from './utils/format.js';
import {loginShopee} from './utils/shopee.js';
let initialized = false;
let page;

// folder check
const jsondir = './finaljson';
if (!fs.existsSync(jsondir)) {
  console.log('[+] Create folder resultjson');
  fs.mkdirSync(jsondir);
}

const csvdir = './resultcsv';
if (!fs.existsSync(csvdir)) {
  console.log('[+] Create folder resultcsv');
  fs.mkdirSync(csvdir);
}

// delay func
export function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}
let product = [];

function isInitialized() {
  return initialized;
}

export async function initialize() {
  console.log('Membuat instance puppeteer.');

  //puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--force-device-scale-factor' && 'start-maximized'],
    devtools: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });

  page = await browser.newPage();

  // await page.setRequestInterception(false);

  await page.setViewport({width: 1920, height: 1080});

  // await page.setViewport({width: 1920, height: 1080});
  //        await page.setJavaScriptEnabled(true);
  await page.setDefaultNavigationTimeout(0);

  //        const userAgent = 'CharacterAI/1.0.0 (iPhone; iOS 14.4.2; Scale/3.00)';
  //        await page.setUserAgent(userAgent);

  console.log('Puppeteer - Done with setup');
  initialized = true;
  console.log(initialized);
}

await initialize();
if (initialized == true) {
  // await tesKoneksi(page);
  await loginShopee(page);
}

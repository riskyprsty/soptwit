import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

let initialized = false;
let page;

// console.log('wes kah,', initialized);

// delay func
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}
let product = [];

function isInitialized() {
  return initialized;
}

async function scrapeAffiliate(page) {
  const hasil = fs.readFileSync(path.resolve('cookies1.json'));
  const cookies = JSON.parse(hasil);
  await page.setCookie(...cookies);
  console.log('iki tes koneksi');
  await page.goto('https://affiliate.shopee.co.id/offer/product_offer', {
    timeout: 0,
    waitUntil: 'networkidle0',
  });

  // tab produk kencatikan
  await page.waitForSelector('#rc-tabs-0-tab-100630 > div');
  let tab = await page.$('#rc-tabs-0-tab-100630');
  // await tab.waitForSelector(".EllipsisHover__content");
  // let tabText = await tab.$eval(
  //   ".EllipsisHover__content",
  //   (node) => node.innerText
  // );
  // console.log(tabText);
  await tab.click();

  //tess
  await page.waitForSelector('.page-page', {timeout: 6000});
  let tes = await page.$$('span.page-page');
  console.log(tes.length);
  // ambil gambar + nama produk
  await page.waitForSelector('.AffiliateItemCard');
  const items = await page.$$('.AffiliateItemCard');
  console.log(items.length);

  const randomSamples = getMultipleRandom(items, 5);

  console.log(randomSamples.length);

  for (const item of randomSamples) {
    await item.waitForSelector('.ItemCard__image img', {timeout: 5000});
    const image = await item.$eval('.ItemCard__image img', (img) => img.src);
    await item.waitForSelector('.ItemCard__name', {timeout: 5000});
    const name = await item.$eval('.ItemCard__name', (name) => name.innerText);
    await item.waitForSelector('input.ant-checkbox-input', {timeout: 10000});
    const checkbox = await item.$('input.ant-checkbox-input');
    // click checkbox
    if (checkbox) {
      await delay(1000);
      await checkbox.click();
      await delay(1000);
      console.log('berhasil click check box');
    } else {
      console.error('gagal click check box');
    }

    product.push({image: image, name_product: name});
  }

  // klik link masallS
  const button = await page.$(
    'div.product-offer-list-wrap button.ant-btn-primary > span',
  );
  if (button) {
    await button.click();
    await delay(1000);
  }
  await page.waitForSelector(
    'span.ant-form-item-children button.ant-btn-primary > span',
  );

  // download handle
  let downloadPath = path.resolve('./resultcsv');

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  // klik csv
  const buttonCsv = await page.$(
    'span.ant-form-item-children button.ant-btn-primary > span',
  );
  await buttonCsv.click();

  // console.log("sukses");
  watch(
    './resultcsv',
    {recursive: true, filter: /\.csv$/, delay: 5000},
    async function (evt, name) {
      if (evt == 'update') {
        console.log('%s sudah terdownload.', name);

        const csvresult = await csvformatter(name);

        const updatedCsvResult = csvresult.map((item, index) => {
          if (index < product.length) {
            return {
              ...item,
              product_image: product[index].image,
              //name_product: product[index].name_product,
            };
          }

          return item;
        });

        await fs.writeFile(
          path.resolve('./finaljson/result.json'),
          JSON.stringify(updatedCsvResult),
        );
        console.log(updatedCsvResult);
        await browser.close();
        await fs.unlink(name);
        process.exit();
      }
    },
  );
}

async function tesKoneksi(page) {
  const hasil = fs.readFileSync(path.resolve('cookies1.json'));
  const cookies = JSON.parse(hasil);
  await page.setCookie(...cookies);
  console.log('iki tes koneksi');
  await page.goto('https://affiliate.shopee.co.id/offer/product_offer', {
    timeout: 0,
    waitUntil: 'networkidle0',
  });

  const screenData = await page.screenshot({
    encoding: 'binary',
    type: 'jpeg',
    quality: 100,
  });

  if (!!screenData) {
    fs.writeFileSync('gvhbjhgfydtfyguhiasndlmwjld.jpg', screenData);
    console.log('wes kah,', initialized);
  } else {
    throw Error('Unable to take screenshot');
  }

  console.log(!isInitialized());
}

export async function initialize() {
  console.log('Membuat instance puppeteer.');

  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--force-device-scale-factor', '--disable-gpu'],
  });

  page = await browser.newPage();

  await page.setRequestInterception(false);

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
  await scrapeAffiliate(page);
}

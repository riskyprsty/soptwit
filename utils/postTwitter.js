import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import {getFiles} from './format.js';
import {trendJoin} from './trendsx.js';
import {getCookiesTwitter} from './getCookiesTwitter.js';
import {downloadImage} from './dowloadImage.js';
export const postTwitter = async (page) => {
  //dowload image
  await downloadImage();

  //get trending
  const finaljson = JSON.parse(fs.readFileSync('./finaljson/result.json'));
  const trend = await trendJoin();
  // delay func
  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  await getCookiesTwitter(page);
  const cookiesString = fs.readFileSync(path.resolve('./cookies_x.json'));
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);
  await page.goto('https://twitter.com/home?lang=id');

  //type
  await page.waitForSelector(
    'div.DraftEditor-editorContainer > div > div > div > div',
    {timeout: 15000},
  );
  const typing = await page.$(
    'div.DraftEditor-editorContainer > div > div > div > div',
  );
  let akhir =
    'REKOMENDASI PRODUK KECANTIKAN😍😍😍\n' +
    finaljson.map((value, key) => `${key + 1} Link : ${value.product_link}\n`);
  akhir += trend;
  await typing.click();
  await typing.type(akhir, {delay: 120});
  console.log('done');

  //upload
  let files = await getFiles('./img');
  // const files = [
  //   './img/id-11134207-7r98o-lr2iabamx4gd0e.webp.jpg',
  //   './img/id-11134207-7r98q-lsmno23jxq4982.webp.jpg',
  // ];
  const UploadElement = await page.$('input[type="file"]');
  await page.waitForSelector('input[type=file]');
  files = files.slice(2);
  await UploadElement.uploadFile(...files);
  await fs.unlinkSync(...files);
  // for (let index = 1; index < files.length; index++) {
  //   const filePath = files[index];
  //   await UploadElement.uploadFile(filePath);
  // }
  // for (const upload of files) {
  //   await UploadElement.uploadFile(upload);
  //   console.log(upload);
  // }

  //console.log(files);
};

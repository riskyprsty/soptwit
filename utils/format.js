import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('./resultcsv');

function getFiles(dir, files = []) {
  try {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
      const name = `${dir}/${file}`;
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files);
      } else {
        files.push(name);
      }
    }
    return files;
  } catch (err) {
    console.error(`ERROR in getFiles : ${err}`);
  }
}

export async function csvformatter(filename) {
  try {
    const csvFilePath = filename;
    const jsonArray = await csv({
      includeColumns: /(Nama Produk|Link Komisi Ekstra)/,
    }).fromFile(csvFilePath);

    const result = jsonArray.map((item) => ({
      product_name: item['Nama Produk'],
      product_link: item['Link Komisi Ekstra'],
    }));
    return result;
  } catch (err) {
    console.error(`ERROR  in csvformatter : ${err}`);
  }
}

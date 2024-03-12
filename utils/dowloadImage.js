import path from 'path';
import fs from 'fs';
import https from 'https';

function downloadFile(url) {
  const filename = path.basename(url);
  https.get(url, (res) => {
    const fileStream = fs.createWriteStream(`./img/${filename}.png`);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();

      console.log('Download finished');
    });
  });
}

export async function downloadImage() {
  let dir = path.resolve('./img');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const finaljson = JSON.parse(
    fs.readFileSync(path.resolve('./finaljson/result.json')),
  );
  // console.log(finaljson);
  for (const final of finaljson) {
    downloadFile(final.product_image);
    // console.log(hasil);
  }
}

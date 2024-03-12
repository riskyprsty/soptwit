import axios from 'axios';

export const getNameTrends = async () => {
  try {
    const trends = await axios.get('https://api-tools.tribone.my.id/trendsx');
    const json = trends.data.data[1].data;
    const jsonAsArray = json.sort((a, b) => {
      if (a.tweet_count > b.tweet_count) {
        return -1;
      }
    });
    const hasil = jsonAsArray.map((value, key) => ({
      nama: value.name,
    }));

    let results = [];
    for (let i = 0; i < 9; i++) {
      const hasil2 = {
        nama: jsonAsArray[i].name,
      };
      results.push(hasil2);
    }

    return results;
  } catch (err) {
    console.error(`Error! in get trends name  : ${err}`);
  }
};

export const trendJoin = async () => {
  try {
    const hasil = await getNameTrends();
    const akhir = hasil.map((value) => value.nama);
    const joinHasil = akhir.join(' ');
    return joinHasil;
    // console.log(hasil);
  } catch (err) {
    console.error(`Error! in trend JOIN : ${err}`);
  }
};
console.log(await trendJoin());

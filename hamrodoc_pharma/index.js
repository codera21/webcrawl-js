const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://www.hamrodoctor.com/';

const axiosInstance = axios.create({
   baseUrl: baseUrl,
   timeout: 5000,
   headers: {
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 { (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
   }
});


const main = async () => {
   const totalPage = 7;
   const totalData = [];

   for (let page = 1; page <= totalPage; page++) {

      let url = `https://www.hamrodoctor.com/pharmaceuticals/index/page:${page}`;
      let res = await axiosInstance.get(url);
      let $ = cheerio.load(res.data);

      $('div.simple-list div.tg-directposthead h3 a').each((i, el) => {
         let link = $(el).attr('href');
         let linkUrl = `https://www.hamrodoctor.com${link}`;

         axiosInstance.get(linkUrl).then(res => {
            let $ = cheerio.load(res.data);
            let details = {};
            let pharmaName = $('div.card-view h3 b').text();
            details.pharmaName = pharmaName;
            $('ul.pharma li').each((i, el) => {
               let listVal = $(el).text().split(':');
               let [col, val] = listVal;
               if (col != 'Email') {
                  details[col] = val;
               }
            });
            totalData.push(details);
         });
      });
   }
   console.log(JSON.stringify(totalData));
};

main();





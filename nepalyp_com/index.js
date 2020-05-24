const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const baseUrl = 'https://www.nepalyp.com/';


const axiosInstance = axios.create({
   baseUrl: baseUrl,
   timeout: 60000,
   headers: {
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 { (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
   }
});

let totalData = [];
let url = `http://www.nepalyp.com/category/Pharmacies`;

const res = await axiosInstance.get(url)
let $ = cheerio.load(res.data);

$('div.company h4 a').each((i, el) => {
   let link = $(el).attr('href');
   let url = `http://www.nepalyp.com${link}`;
   const res = await axiosInstance.get(url);
   let $ = cheerio.load(res.data);

   let details = {};
   let pharmaName = $('b#company_name').text();
   details.pharmaName = pharmaName;
   $('div.cmp_details_in div.info').each((i, el) => {
      let col = $(el).find('div.label').text();
      let val = $(el).find('div.text').text();
      if (val != '') {
         if (col != 'E-mail') {
            details[col] = val;
         }
      }
   });
   console.log(details);
   totalData.push(details);
});
console.log(JSON.stringify(totalData));




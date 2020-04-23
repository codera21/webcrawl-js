const fs = require('fs');
const cheerio = require('cheerio');


const files = fs.readdirSync('./files');
const totalData = [];
files.forEach(file => {

   let html = fs.readFileSync(`./files/${file}`);
   let $ = cheerio.load(html.toString());

   let details = {};
   details.pharmaName = $('b#company_name').text();


   $('div.cmp_details_in div.info').each((i, el) => {
      let col = $(el).find('div.label').text();
      let val = $(el).find('div.text').text();
      if (val != '') {
         if (col != 'E-mail') {
            details[col] = val;
         }
      }
   });

   totalData.push(details);
});

console.log(JSON.stringify(totalData));
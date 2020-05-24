const BaseCrawler = require("../core/BaseCrawler");
const fs = require("fs");
// const cheerio = require("cheerio");
const filePath = __dirname + '/files/';

class KathmanduPostCovidTracker extends BaseCrawler {
   constructor() {
      const baseUrl = "https://kathmandupost.com";
      super(baseUrl);
   }

   async main() {
      console.log("loading ktm post site ... ")
      const baseUrl = "https://kathmandupost.com/covid19"
      const result = await this.get(baseUrl);
      let nepalData = result.match(/district\_data\s\=\sJSON\.parse\(\'(.*)\'\)\;function districtClick/);
      nepalData = JSON.parse(nepalData[1]);

      try {
         var date = new Date();
         fs.writeFileSync(
            `${filePath}covid_${`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}.json`,
            JSON.stringify(nepalData)
         )
      } catch (err) {
         console.log(err);
      };
   }
}

new KathmanduPostCovidTracker().main();
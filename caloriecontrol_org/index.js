const BaseCrawler = require("../core/BaseCrawler");
const fs = require("fs");
// const cheerio = require("cheerio");
const fetch = require("node-fetch");
const filePath = __dirname + "/files/";

const axios = require("axios");

class CaloriesControlOrg extends BaseCrawler {
  constructor() {
    const baseUrl = "https://caloriecontrol.org/";
    super(baseUrl);
  }

  async main() {
    console.log("loading calorie control site ... ");

    

    const res = await this.post(
      "https://caloriecontrol.org/wp-content/themes/ultimate-wp/calcontrol/searchFood.php",
      "keyword=&page=0&ppage=10000",
      {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,fr;q=0.8,ne;q=0.7,pt;q=0.6",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      }
    );

    fs.writeFileSync(
      `${filePath}caloriesControl_${new Date()}.json`,
      JSON.stringify(res)
    );
  }
}

new CaloriesControlOrg().main();

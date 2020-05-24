#!/usr/bin/env node

const BaseCrawler = require("../core/BaseCrawler");
const fs = require("fs");
const cheerio = require("cheerio");
const filePath =
  "/home/atul/Documents/PersonalProjects/webcrawl-js/hamrobazaar/files/";

class hamrobazaar extends BaseCrawler {
  constructor() {
    const baseUrl = "https://hamrobazaar.com/";
    super(baseUrl);
  }

  async main() {
    const urls = [
      {
        url:
          "https://hamrobazaar.com/c62-automobiles-motorcycle?catid=62&offset=",
        type: "bike",
      },
      {
        url: "https://hamrobazaar.com/c48-automobiles-cars?catid=48&offset=",
        type: "cars",
      },
      {
        url:
          "https://hamrobazaar.com/c31-mobile-and-accessories-handsets?catid=31&offset=",
        type: "cellphones",
      },
    ];

    const i = process.argv[2];
    this.retArr = [];
    this.resetAxios();
    const cookieStr = await this.getCookie("https://hamrobazaar.com/", {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Host: "hamrobazaar.com",
      "Upgrade-Insecure-Requests": "1",
      Referer: "https://hamrobazaar.com/",
    });

    console.log(`Procesing: ${urls[i].type}`);
    let products = await this.processCategory(urls[i], cookieStr);
    fs.writeFileSync(
      `${filePath}${urls[i].type}_${new Date()}.json`,
      JSON.stringify(products)
    );
  }

  async processCategory(urlOb, cookieStr) {
    let offset = 0;
    //  let retArr = [];
    let data = false;
    let $ = "";
    while (offset <= 220) {
      console.log(`processing url : ${urlOb.url}${offset}`);
      data = await this.get(`${urlOb.url}${offset}`, {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Host: "hamrobazaar.com",
        "Upgrade-Insecure-Requests": "1",
        Cookie: cookieStr,
        Referer: `${urlOb.url}${offset - 20 < 0 ? 0 : offset}`,
      });
      $ = cheerio.load(data);

      $(
        "td > table:nth-child(14) > tbody > tr > td:nth-child(2) > table > tbody"
      ).each((i, el) => {
        let ret = {};
        ret.type = urlOb.type;
        ret.date = new Date().toLocaleDateString("en-CA");
        ret.url = $(el).find('tr:nth-child(1) a[target="_blank"]').attr("href");

        if (ret.url !== undefined) {
          ret.name = $(el).find('tr:nth-child(1) a[target="_blank"]').text();

          const price = $(el).find("tr:nth-child(1) td:nth-child(5)").text();
          [ret.price] = price.match(/[0-9\,]+/);
          // console.log(ret);
          this.retArr.push(ret);
        }
      });

      offset = offset + 20;
    }

    return this.retArr;
  }
}

new hamrobazaar().main();

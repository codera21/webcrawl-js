const cheerio = require("cheerio");
const fs = require("fs");

const BaseCrawler = require("../core/BaseCrawler");

const filePath = `${__dirname}/files/`;

class CaloriesControlOrg extends BaseCrawler {
  constructor() {
    const baseUrl = "https://www.bolpatranepal.com/";
    super(baseUrl);
  }

  async main() {
    const contents = await this.get(
      "/notice/all_notices?table_type=table_all_notices&q%5Bproject_category_cont%5D=Irrigation%2FAgriculture&q%5Bnotice_category_cont%5D=&q%5Bprocurement_type_cont%5D=&q%5Babove_date%5D=&q%5Bbelow_date%5D=&_=1598949554059"
    );

    const $ = cheerio.load(contents);
    const finalRet = [];

    $("h2.lead a").each((i, el) => {
      this.processLink($(el).attr("href")).then(res => {
        finalRet.push(res);
        fs.writeFileSync(`${filePath}final.json`, JSON.stringify(finalRet));
      });
    });
  }

  async processLink(link) {
    const res = await this.get(link);
    const $ = cheerio.load(res);
    const ret = {};

    const desc = $(
      "body > div:nth-child(1) > div > div:nth-child(3) > div > div.card.padding_card.col-md-9 > div > div.col-md-4.pt-4"
    )
      .text()
      .split("\n\n");

    desc.forEach(el => {
      const colRow = el.trim().split(":");
      ret[colRow[0].trim()] = colRow[1].trim();
    });
    let imgSrc = $("#img-resource > img").attr("src");
    if (imgSrc === undefined) {
      imgSrc = "";
    } else {
      imgSrc = `https://www.bolpatranepal.com/${imgSrc}`;
    }

    ret.imgSrc = imgSrc;
    return ret;
  }
}

new CaloriesControlOrg().main();

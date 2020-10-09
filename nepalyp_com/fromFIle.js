const fs = require("fs");
const cheerio = require("cheerio");

const files = fs.readdirSync("./files");
const totalData = [];
files.forEach(file => {
  const html = fs.readFileSync(`./files/${file}`);
  const $ = cheerio.load(html.toString());

  const details = {};
  details.pharmaName = $("b#company_name").text();

  $("div.cmp_details_in div.info").each((i, el) => {
    const col = $(el)
      .find("div.label")
      .text();
    const val = $(el)
      .find("div.text")
      .text();
    if (val !== "") {
      if (col !== "E-mail") {
        details[col] = val;
      }
    }
  });

  totalData.push(details);
});

console.log(JSON.stringify(totalData));

const axios = require("axios");
const cheerio = require("cheerio");

const globalHeaders = {
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
};

class BaseCrawler {
  constructor(baseUrl, useCookie = true) {
    this.baseUrl = baseUrl;
    this.useCookie = useCookie;
    this.axios = axios.create({
      baseUrl: this.baseUrl,
      timeout: 60000,
      withCredentials: this.useCookie,
    });
  }

  async get(url, headers = {}) {
    let result = "";
    try {
      result = await this.axios.get(url, {
        headers: { ...globalHeaders, ...headers },
      });
      console.log(`Status: ${result.status} , ${result.statusText} `);
      return result.data;
    } catch (err) {
      console.log(`Error while loading`);
    }
    return false;
  }

  resetAxios() {
    console.log("Starting a new Session");
    this.axios = null;

    this.axios = axios.create({
      baseUrl: this.baseUrl,
      timeout: 60000,
      withCredentials: this.useCookie,
    });
  }

  async getCookie(url, headers = {}) {
    let result = null;
    try {
      result = await this.axios.get(url, {
        headers: { ...globalHeaders, ...headers },
      });
      const cookies = [];
      result.headers["set-cookie"].forEach((element) => {
        cookies.push(element.split(";")[0]);
      });

      return cookies.join(" ");
    } catch (err) {
      console.log("Error on cookie");
    }

    return false;
  }
}

module.exports = BaseCrawler;

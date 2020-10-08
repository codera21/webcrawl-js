const axios = require("axios");

const globalHeaders = {
  "User-Agent":
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
};

class BaseCrawler {
  constructor(baseUrl, useCookie = true) {
    this.baseUrl = baseUrl;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
    });
  }

  async get(url, headers = {}) {
    let result = "";
    const options = {
      url: url,
      method: "GET",
      headers: {
        ...globalHeaders,
        ...headers,
      },
    };
    try {
      result = await this.axios(options);
      console.log(`${url} Status: ${result.status} , ${result.statusText} `);
      return result.data;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  async post(url, data = {}, headers = {}) {
    let result = null;
    const options = {
      url: url,
      method: "POST",
      headers: {
        ...globalHeaders,
        ...headers,
      },
      data: data,
    };
    try {
      result = await this.axios(options);
      console.log(`Status: ${result.status} , ${result.statusText} `);
      return result.data;
    } catch (err) {
      console.log(err);
    }
    return false;
  }
}

module.exports = BaseCrawler;

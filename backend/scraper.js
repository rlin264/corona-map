const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=0';

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const statsTable = $('table[class="waffle no-grid"] ');
    console.log(html);
    console.log(statsTable.length);
  })
  .catch(console.error);
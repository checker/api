const axios = require('axios');
const cheerio = require('cheerio');

const check = (word, callback) => {
   var url = `https://steamcommunity.com/id/${word}`;
   
   axios.get(url).then(function (response) {
      var $ = cheerio.load(response.data);
      var elem = $('body').find('h3').length;
      var milliseconds = new Date().getTime();
      var status = (elem == 1) ? "available" : "taken";
      callback(status, milliseconds)
   }).catch(console.error);

}

module.exports = check;
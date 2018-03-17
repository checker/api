const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

function CheckSteam(service, word, res) {

   var url = "";

   if (service == "steamid") {
      url = `https://steamcommunity.com/id/${word}`;
   }

   if (service == "steamgroup") {
      url = `https://steamcommunity.com/groups/${word}`;
   }
   
   axios.get(url).then(function (response) {
      var $ = cheerio.load(response.data);
      var elem = $('body').find('h3').length;
      var milliseconds = new Date().getTime();
      var status = (elem == 1) ? "available" : "taken";
      res.json({ service: service, username: word, status: status, timestamp: milliseconds });
   }).catch(console.error);

}

module.exports = CheckSteam;
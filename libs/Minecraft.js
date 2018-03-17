const express = require('express');
const router = express.Router();
const axios = require('axios');
const faker = require('faker');

function CheckMinecraft(service, word, res) {

   var url = `https://api.mojang.com/users/profiles/minecraft/${word}`;
   var status = "";

   axios.get(url, null, { "headers": { "User-Agent": faker.internet.userAgent }})
      .then(results = (r) => {
         var milliseconds = new Date().getTime();
         try {
            var data = JSON.parse(r.data);
            status = "taken";
         } catch(err) {
            status = "available";
         }
         res.json({ service: service, username: word, status: status, timestamp: milliseconds });
      })
      .catch(console.error)

}

module.exports = CheckMinecraft;
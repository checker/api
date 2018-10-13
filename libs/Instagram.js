const express = require('express');
const router = express.Router();
const axios = require('axios');
const faker = require('faker');

function CheckInstagram(service, word, res) {
      res.type('json');
      
   var token = "";
   var mid = "";
   var cookie = "";

   axios.get('https://www.instagram.com/')
      .then(function(response) {
         token = response.headers['set-cookie'][5].split(';')[0].split('=')[1];
         mid = response.headers['set-cookie'][6].split(';')[0].split('=')[1];
         cookie = `mid=${mid}; csrftoken=${token}; rur=ASH`;

         var config = {
            "headers": {
               "Host": "www.instagram.com",
               "Referer": "https://www.instagram.com",
               "x-csrftoken": token,
               "Cookie": cookie,
               "User-Agent": faker.internet.userAgent,
               "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            }
         }
      
         var payload = {
            "first_name": faker.name.firstName(),
            "username": word,
            "email": faker.internet.email(),
            "password": faker.internet.password(16)
          }
         
         axios.post('https://www.instagram.com/accounts/web_create_ajax/attempt/', payload, config)
               .then(function (response) {
            var milliseconds = new Date().getTime();
            var status = (response.data.dryrun_passed) ? "available" : "taken";
            res.json({ service: service, username: word, status: status, timestamp: milliseconds });
         }).catch(console.error);
         
      }).catch(console.error);

    
    
}

module.exports = CheckInstagram;
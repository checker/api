const express = require('express');
const router = express.Router();
const axios = require('axios');
const Twitter = require('twitter-lite');

function CheckTwitter(service, word, res) {

   var config = require('../configs/twitter.json');
   var client = new Twitter(config);

   client.get('users/show', {screen_name: word, include_entities: false})
         .then(results = (r) => {
            var milliseconds = new Date().getTime();
            var status = ('screen_name' in r) ? "taken" : "available";
            res.json({ service: service, username: word, status: status, timestamp: milliseconds });
         })
         .catch(console.error)

}

module.exports = CheckTwitter;
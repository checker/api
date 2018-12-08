const express = require('express');
const router = express.Router();
const twitch = require('twitch-api-v5');

function CheckTwitch(service, word, res) {
   res.type('json');

   twitch.clientID = process.env.TWITCH_CLIENT_ID;

   twitch.users.usersByName({"users": [word]}, function(error, response) {
      if(error) {
         console.log(error);
      } else {
         var status = (response['_total'] == 1) ? "taken" : "available";
         var milliseconds = new Date().getTime();
         res.json({ service: service, username: word, status: status, timestamp: milliseconds });
      }
   });
}

module.exports = CheckTwitch;
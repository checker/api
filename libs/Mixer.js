const express = require('express');
const router = express.Router();
const axios = require('axios');

function CheckMixer(service, word, res) {

   const url = `https://mixer.com/api/v1/channels/${word}`;

   axios.get(url).then(function (obj) {
      var milliseconds = new Date().getTime();
      var status = ('statusCode' in obj.data) ? "available" : "taken";
      res.json({ service: service, username: word, status: status, timestamp: milliseconds });
   }).catch(console.error);
}

module.exports = CheckMixer;